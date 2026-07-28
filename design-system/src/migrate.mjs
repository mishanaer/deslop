import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { migrationExtensions, readProjectSources } from "./source-files.mjs"

const defaultRegistryPath = fileURLToPath(
  new URL("../registry/migrations.json", import.meta.url),
)

function parseNamedSpecifiers(block) {
  if (/\/\*|\/\//.test(block)) return null

  const parsed = block
    .slice(1, -1)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((raw) => {
      const match = raw.match(
        /^(type\s+)?([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/,
      )

      return match
        ? {
            raw,
            typeOnly: Boolean(match[1]),
            imported: match[2],
            local: match[3] ?? match[2],
          }
        : null
    })

  return parsed.every(Boolean) ? parsed : null
}

function formatSpecifier(imported, local) {
  return imported === local ? imported : `${imported} as ${local}`
}

function migratePackageImports(source, registry, file, report) {
  const packageNames = Object.keys(registry.packageImports ?? {})
  if (packageNames.length === 0) return source

  const escapedNames = packageNames
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")
  const pattern = new RegExp(
    `(^|\\n)([ \\t]*)import\\s+(\\{[^}]*\\})\\s+from\\s+(["'])(${escapedNames})\\4[ \\t]*(;?)`,
    "g",
  )

  return source.replace(
    pattern,
    (statement, lineStart, indent, namedBlock, quote, packageName, semicolon) => {
      const specifiers = parseNamedSpecifiers(namedBlock)

      if (!specifiers) {
        report.reviewItems.push({
          file,
          kind: "unsupported-import-syntax",
          source: packageName,
          message: `Review the ${packageName} import manually; comments or complex specifiers are preserved.`,
        })
        return statement
      }

      const mappings = registry.packageImports[packageName]
      const remaining = []
      const grouped = new Map()

      for (const specifier of specifiers) {
        const mapping = !specifier.typeOnly ? mappings[specifier.imported] : null

        if (!mapping) {
          remaining.push(specifier.raw)
          report.reviewItems.push({
            file,
            kind: "unmapped-package-import",
            source: packageName,
            symbol: specifier.imported,
            message: `No verified Deslop mapping exists for ${packageName}:${specifier.imported}.`,
          })
          continue
        }

        const targetSpecifiers = grouped.get(mapping.module) ?? []
        targetSpecifiers.push(formatSpecifier(mapping.import, specifier.local))
        grouped.set(mapping.module, targetSpecifiers)
      }

      if (grouped.size === 0) return statement

      const imports = []
      if (remaining.length > 0) {
        imports.push(
          `${indent}import { ${remaining.join(", ")} } from ${quote}${packageName}${quote}${semicolon}`,
        )
      }
      for (const [target, targetSpecifiers] of grouped) {
        imports.push(
          `${indent}import { ${targetSpecifiers.join(", ")} } from ${quote}${target}${quote}${semicolon}`,
        )
      }

      report.transformations.push({
        kind: "package-import",
        from: packageName,
        to: [...grouped.keys()],
      })

      return `${lineStart}${imports.join("\n")}`
    },
  )
}

function migrateLocalUiImports(source, registry, file, report) {
  const localUi = registry.localUi
  if (!localUi) return source

  const allowedModules = new Set(localUi.modules)
  const pattern = /\b(from\s+|import\s+)(["'])([^"'\n]+)\2/g

  return source.replace(pattern, (statement, keyword, quote, modulePath) => {
    const prefix = localUi.sourcePrefixes.find((candidate) =>
      modulePath.startsWith(candidate),
    )
    if (!prefix) return statement

    const localModule = modulePath.slice(prefix.length)
    if (!allowedModules.has(localModule)) {
      report.reviewItems.push({
        file,
        kind: "unknown-local-ui-module",
        source: modulePath,
        message: `No public Deslop module is registered for ${localModule}.`,
      })
      return statement
    }

    const target = `${localUi.targetPrefix}${localModule}`
    report.transformations.push({
      kind: "local-ui-import",
      from: modulePath,
      to: target,
    })
    return `${keyword}${quote}${target}${quote}`
  })
}

function reportUnsupportedPackageImports(source, registry, file, report) {
  for (const packageName of Object.keys(registry.packageImports ?? {})) {
    const escapedName = packageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const pattern = new RegExp(
      `import\\s+(?!\\{)[^;\\n]+?\\s+from\\s+["']${escapedName}["']`,
      "g",
    )

    if (pattern.test(source)) {
      report.reviewItems.push({
        file,
        kind: "unsupported-import-syntax",
        source: packageName,
        message: `Default or namespace imports from ${packageName} require manual review.`,
      })
    }
  }
}

export function transformSource(source, { registry, file = "<source>" }) {
  const report = { transformations: [], reviewItems: [] }
  let output = migrateLocalUiImports(source, registry, file, report)
  output = migratePackageImports(output, registry, file, report)
  reportUnsupportedPackageImports(source, registry, file, report)

  return {
    source: output,
    changed: output !== source,
    transformations: report.transformations,
    reviewItems: report.reviewItems,
  }
}

export async function loadMigrationRegistry(registryPath = defaultRegistryPath) {
  const absolutePath = path.resolve(registryPath)
  const registry = JSON.parse(await readFile(absolutePath, "utf8"))

  if (
    registry.schemaVersion !== 1 ||
    typeof registry.packageImports !== "object" ||
    !Array.isArray(registry.localUi?.modules)
  ) {
    throw new Error(`Unsupported migration registry: ${absolutePath}`)
  }

  return registry
}

export async function migrateProject({
  cwd = process.cwd(),
  dryRun = false,
  registryPath = defaultRegistryPath,
} = {}) {
  const root = path.resolve(cwd)
  const registry = await loadMigrationRegistry(registryPath)
  const sources = await readProjectSources(root, { extensions: migrationExtensions })
  const changedFiles = []
  const reviewItems = []

  for (const file of sources) {
    const result = transformSource(file.source, { registry, file: file.path })
    reviewItems.push(...result.reviewItems)

    if (!result.changed) continue

    changedFiles.push({
      path: file.path,
      transformations: result.transformations,
    })

    if (!dryRun) {
      await writeFile(file.absolutePath, result.source, "utf8")
    }
  }

  return {
    schemaVersion: 1,
    root,
    mode: dryRun ? "dry-run" : "write",
    scannedFiles: sources.length,
    changedFiles,
    reviewItems,
    summary: {
      changedFiles: changedFiles.length,
      transformations: changedFiles.reduce(
        (total, file) => total + file.transformations.length,
        0,
      ),
      reviewItems: reviewItems.length,
    },
  }
}

export function formatMigrationReport(result) {
  const lines = [
    `Deslop migration (${result.mode})`,
    `Scanned files: ${result.scannedFiles}`,
    `Changed files: ${result.summary.changedFiles}`,
    `Transformations: ${result.summary.transformations}`,
    `Review items: ${result.summary.reviewItems}`,
  ]

  for (const file of result.changedFiles) {
    lines.push(`\n${file.path}`)
    for (const transformation of file.transformations) {
      lines.push(`  ${transformation.kind}: ${transformation.from} → ${transformation.to}`)
    }
  }

  if (result.reviewItems.length > 0) {
    lines.push("\nManual review")
    for (const item of result.reviewItems) {
      lines.push(`  ${item.file}: ${item.message}`)
    }
  }

  return `${lines.join("\n")}\n`
}

export { defaultRegistryPath }
