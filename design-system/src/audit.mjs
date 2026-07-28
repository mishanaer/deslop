import { access, readFile, readdir } from "node:fs/promises"
import { extname, relative, resolve, sep } from "node:path"
import { pathToFileURL } from "node:url"

const CODE_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx"])
const STYLE_EXTENSIONS = new Set([".css", ".scss", ".sass"])
const IGNORED_DIRECTORIES = new Set([
  ".deslop",
  ".git",
  ".next",
  ".nuxt",
  ".output",
  ".svelte-kit",
  ".turbo",
  ".vite",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out",
  "public",
  "storybook-static",
  "test-results",
  "tests",
  "vendor",
])
const IGNORED_FILE = /(?:^|\/)(?:__tests__|fixtures?|storybook)(?:\/|$)|\.(?:spec|test|stories)\.[cm]?[jt]sx?$/

const DIRECT_UI_PACKAGES = [
  { pattern: /^@radix-ui\//, name: "Radix" },
  { pattern: /^radix-ui(?:\/|$)/, name: "Radix" },
  { pattern: /^lucide-react(?:\/|$)/, name: "Lucide" },
  { pattern: /^sonner(?:\/|$)/, name: "Sonner" },
  { pattern: /^cmdk(?:\/|$)/, name: "cmdk" },
]
const NATIVE_CONTROLS = new Set([
  "button",
  "details",
  "input",
  "select",
  "summary",
  "textarea",
])
const DEPRECATED_TOKENS = [
  "--background",
  "--surface",
  "--elevation-90",
  "--elevation-80",
  "--elevation-70",
  "--elevation-60",
  "--elevation-50",
  "--elevation-40",
  "--elevation-30",
  "--elevation-20",
  "--elevation-10",
  "--elevation-5",
  "--elevation-4",
]

const RULES = {
  "allowlist-invalid": { area: "configuration", title: "Allowlist" },
  "local-ui-module": { area: "components", title: "Local UI modules" },
  "local-ui-import": { area: "components", title: "Local UI imports" },
  "native-control": { area: "components", title: "Native controls" },
  "direct-ui-dependency": { area: "components", title: "Direct UI dependencies" },
  "direct-ui-import": { area: "components", title: "Direct UI imports" },
  "hardcoded-color": { area: "tokens", title: "Hardcoded colors" },
  "tailwind-palette": { area: "tokens", title: "Tailwind palette colors" },
  "deprecated-token": { area: "tokens", title: "Deprecated tokens" },
  "typography-escape": { area: "typography", title: "Typography escapes" },
}

const AREA_ORDER = [
  "configuration",
  "components",
  "tokens",
  "typography",
]

const exists = async (path) => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

const normalizePath = (path) => path.split(sep).join("/")

const maskComments = (source) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " "))
    .replace(/^[\t ]*\/\/.*$/gm, (comment) => comment.replace(/[^\n]/g, " "))

const lineAndColumn = (source, index) => {
  const prefix = source.slice(0, index)
  const lines = prefix.split("\n")
  return { line: lines.length, column: lines.at(-1).length + 1 }
}

const evidenceAt = (source, index, fallback = "") => {
  const lineStart = source.lastIndexOf("\n", index - 1) + 1
  const nextLine = source.indexOf("\n", index)
  const lineEnd = nextLine === -1 ? source.length : nextLine
  return source.slice(lineStart, lineEnd).trim().slice(0, 240) || fallback
}

const makeFinding = ({ rule, file, source = "", index = 0, message, evidence }) => {
  const { line, column } = lineAndColumn(source, index)
  return {
    rule,
    area: RULES[rule]?.area ?? "unknown",
    severity: "error",
    file: normalizePath(file),
    line,
    column,
    message,
    evidence: evidence ?? evidenceAt(source, index),
  }
}

const addRegexFindings = ({ findings, rule, file, source, pattern, message }) => {
  for (const match of source.matchAll(pattern)) {
    findings.push(
      makeFinding({
        rule,
        file,
        source,
        index: match.index,
        message: typeof message === "function" ? message(match) : message,
        evidence: match[0],
      }),
    )
  }
}

const walk = async (directory) => {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(path)))
    else if (entry.isFile()) files.push(path)
  }
  return files
}

const discoverSourceRoots = async (root, configuredRoots) => {
  const candidates = configuredRoots?.length
    ? configuredRoots.map((path) => resolve(root, path))
    : ["src", "app", "pages"].map((path) => resolve(root, path))
  const present = []

  for (const candidate of candidates) {
    if (await exists(candidate)) present.push(candidate)
  }

  if (present.length === 0) return [root]
  return present.filter(
    (candidate, index) =>
      !present.some(
        (other, otherIndex) =>
          index !== otherIndex && candidate.startsWith(`${other}${sep}`),
      ),
  )
}

const isRuntimeFile = (root, path) => {
  const file = normalizePath(relative(root, path))
  if (IGNORED_FILE.test(file) || path.endsWith(".d.ts")) return false
  const extension = extname(path)
  return CODE_EXTENSIONS.has(extension) || STYLE_EXTENSIONS.has(extension)
}

const extractModuleSpecifiers = (source) => {
  const modules = []
  const pattern = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*|\brequire\s*\(\s*)["']([^"']+)["']/g
  for (const match of source.matchAll(pattern)) {
    modules.push({ specifier: match[1], index: match.index })
  }
  return modules
}

const jsxElements = (source) => {
  const elements = []
  const stack = []
  const pattern = /<\/?([A-Za-z][A-Za-z0-9_.]*)\b([^<>]*?)\/?>/g

  for (const match of source.matchAll(pattern)) {
    const full = match[0]
    const tag = match[1]
    const closing = full.startsWith("</")
    const selfClosing = /\/\s*>$/.test(full)

    if (closing) {
      const index = stack.map(({ tag: openTag }) => openTag).lastIndexOf(tag)
      if (index >= 0) stack.splice(index)
      continue
    }

    elements.push({
      tag,
      attributes: match[2] ?? "",
      index: match.index,
      ancestors: stack.map(({ tag: ancestor }) => ancestor),
    })
    if (!selfClosing) stack.push({ tag })
  }

  return elements
}

const auditCode = ({ findings, file, source }) => {
  for (const { specifier, index } of extractModuleSpecifiers(source)) {
    if (
      !specifier.startsWith("@deslop/") &&
      (specifier.startsWith("@/components/ui/") ||
        specifier.startsWith("~/components/ui/") ||
        /(?:^|\/)components\/ui(?:\/|$)/.test(specifier))
    ) {
      findings.push(
        makeFinding({
          rule: "local-ui-import",
          file,
          source,
          index,
          message: `Import ${specifier} bypasses the verified Deslop component layer`,
        }),
      )
    }

    const forbidden = DIRECT_UI_PACKAGES.find(({ pattern }) => pattern.test(specifier))
    if (forbidden) {
      findings.push(
        makeFinding({
          rule: "direct-ui-import",
          file,
          source,
          index,
          message: `Direct ${forbidden.name} import ${specifier} bypasses Deslop`,
        }),
      )
    }
  }

  const elements = jsxElements(source)
  for (const element of elements) {
    if (NATIVE_CONTROLS.has(element.tag) || element.tag === "motion.button") {
      findings.push(
        makeFinding({
          rule: "native-control",
          file,
          source,
          index: element.index,
          message: `Native <${element.tag}> bypasses the matching Deslop component`,
        }),
      )
    }

  }

  addRegexFindings({
    findings,
    rule: "hardcoded-color",
    file,
    source,
    pattern: /#[0-9a-fA-F]{3}(?:[0-9a-fA-F](?:[0-9a-fA-F]{2}){0,2})?(?![0-9a-fA-F])/g,
    message: "Hardcoded color must use a Deslop token",
  })
  addRegexFindings({
    findings,
    rule: "hardcoded-color",
    file,
    source,
    pattern: /\b(?:rgba?|hsla?|oklch|lab|lch)\s*\([^)]*\)/gi,
    message: "Hardcoded color function must use a Deslop token",
  })
  addRegexFindings({
    findings,
    rule: "tailwind-palette",
    file,
    source,
    pattern:
      /\b(?:bg|border|decoration|divide|fill|from|outline|ring|shadow|stroke|text|to|via)-(?:black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d{2,3})?(?:\/\d{1,3})?\b/g,
    message: "Tailwind palette color must use a semantic Deslop color",
  })

  for (const token of DEPRECATED_TOKENS) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    addRegexFindings({
      findings,
      rule: "deprecated-token",
      file,
      source,
      pattern: new RegExp(`${escaped}(?![\\w-])`, "g"),
      message: `Deprecated token ${token} must be replaced with the current semantic token`,
    })
  }

  addRegexFindings({
    findings,
    rule: "typography-escape",
    file,
    source,
    pattern:
      /\btext-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b|\btext-\[(?:\d+(?:\.\d+)?(?:px|rem|em)|var\(--[^\]]*(?:font|size)[^\]]*)\]|\b(?:leading|tracking)-(?:none|tight|snug|normal|relaxed|loose|wide|wider|widest|\[[^\]]+\])\b|\buppercase\b/g,
    message: "Typography metrics must come from a complete Deslop text role",
  })
  addRegexFindings({
    findings,
    rule: "typography-escape",
    file,
    source,
    pattern: /\b(?:fontFamily|fontSize|fontWeight|letterSpacing|lineHeight)\s*:/g,
    message: "Inline typography metrics bypass Deslop text roles",
  })
}

const auditStyles = ({ findings, file, source }) => {
  addRegexFindings({
    findings,
    rule: "hardcoded-color",
    file,
    source,
    pattern: /#[0-9a-fA-F]{3}(?:[0-9a-fA-F](?:[0-9a-fA-F]{2}){0,2})?(?![0-9a-fA-F])/g,
    message: "Hardcoded color must use a Deslop token",
  })
  addRegexFindings({
    findings,
    rule: "hardcoded-color",
    file,
    source,
    pattern: /\b(?:rgba?|hsla?|oklch|lab|lch)\s*\([^)]*\)/gi,
    message: "Hardcoded color function must use a Deslop token",
  })

  for (const token of DEPRECATED_TOKENS) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    addRegexFindings({
      findings,
      rule: "deprecated-token",
      file,
      source,
      pattern: new RegExp(`${escaped}(?![\\w-])`, "g"),
      message: `Deprecated token ${token} must be replaced with the current semantic token`,
    })
  }

  for (const match of source.matchAll(
    /(?:font-family|font-size|font-weight|letter-spacing|line-height)\s*:\s*([^;}{]+)/gi,
  )) {
    const value = match[1].trim()
    if (value === "inherit" || /^var\(--ui-/.test(value)) continue
    findings.push(
      makeFinding({
        rule: "typography-escape",
        file,
        source,
        index: match.index,
        message: "CSS typography metrics must use a Deslop --ui-* role token",
        evidence: match[0],
      }),
    )
  }
}

const globPattern = (glob) => {
  let output = "^"
  for (let index = 0; index < glob.length; index += 1) {
    const character = glob[index]
    if (character === "*" && glob[index + 1] === "*") {
      output += ".*"
      index += 1
    } else if (character === "*") output += "[^/]*"
    else if (character === "?") output += "[^/]"
    else output += character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }
  return new RegExp(`${output}$`)
}

const readAllowlist = async (root, input) => {
  let value = input
  let path

  if (typeof value === "string") {
    path = resolve(root, value)
    value = JSON.parse(await readFile(path, "utf8"))
  } else if (value === undefined) {
    const defaultPath = resolve(root, ".deslop-audit.json")
    if (await exists(defaultPath)) {
      path = defaultPath
      value = JSON.parse(await readFile(path, "utf8"))
    }
  }

  if (value === undefined) return { entries: [], errors: [], sourceRoots: undefined }
  const entries = Array.isArray(value) ? value : value.allow ?? value.allowlist ?? []
  const errors = []

  if (!Array.isArray(entries)) {
    return {
      entries: [],
      errors: ["Allowlist must be an array or an object with an allow array"],
      sourceRoots: value.sourceRoots,
      path,
    }
  }

  const valid = []
  for (const [index, entry] of entries.entries()) {
    const label = `allow[${index}]`
    if (!entry || typeof entry !== "object") {
      errors.push(`${label} must be an object`)
      continue
    }
    if (!(entry.rule === "*" || RULES[entry.rule])) {
      errors.push(`${label}.rule must name a known audit rule`)
      continue
    }
    if (typeof entry.file !== "string" || !entry.file.trim()) {
      errors.push(`${label}.file is required so exceptions stay scoped`)
      continue
    }
    if (typeof entry.reason !== "string" || entry.reason.trim().length < 8) {
      errors.push(`${label}.reason must explain the product exception`)
      continue
    }
    if (entry.expires && Number.isNaN(Date.parse(entry.expires))) {
      errors.push(`${label}.expires must be an ISO date`)
      continue
    }
    if (entry.expires && Date.parse(entry.expires) < Date.now()) {
      errors.push(`${label} expired on ${entry.expires}`)
      continue
    }
    valid.push({ ...entry, file: normalizePath(entry.file), _pattern: globPattern(entry.file) })
  }

  return { entries: valid, errors, sourceRoots: value.sourceRoots, path }
}

const allowanceFor = (finding, entries) =>
  entries.find(
    (entry) =>
      (entry.rule === "*" || entry.rule === finding.rule) &&
      entry._pattern.test(finding.file) &&
      (entry.line === undefined || Number(entry.line) === finding.line) &&
      (entry.match === undefined ||
        `${finding.message}\n${finding.evidence}`.includes(entry.match)),
  )

const sortFindings = (left, right) =>
  left.file.localeCompare(right.file) ||
  left.line - right.line ||
  left.column - right.column ||
  left.rule.localeCompare(right.rule)

const summarize = (violations, allowed) => {
  const byRule = {}
  const byArea = Object.fromEntries(AREA_ORDER.map((area) => [area, 0]))
  for (const finding of violations) {
    byRule[finding.rule] = (byRule[finding.rule] ?? 0) + 1
    byArea[finding.area] = (byArea[finding.area] ?? 0) + 1
  }
  return {
    violations: violations.length,
    allowed: allowed.length,
    totalFindings: violations.length + allowed.length,
    byRule,
    byArea,
  }
}

export async function auditProject({
  cwd = process.cwd(),
  root,
  strict = true,
  allowlist,
  sourceRoots,
} = {}) {
  const projectRoot = resolve(root ?? cwd)
  const allowlistConfig = await readAllowlist(projectRoot, allowlist)
  const configuredRoots = sourceRoots ?? allowlistConfig.sourceRoots
  const runtimeRoots = await discoverSourceRoots(projectRoot, configuredRoots)
  const allPaths = (await Promise.all(runtimeRoots.map(walk))).flat()
  const files = [...new Set(allPaths)].filter((path) => isRuntimeFile(projectRoot, path))
  const findings = []

  for (const error of allowlistConfig.errors) {
    findings.push({
      rule: "allowlist-invalid",
      area: "configuration",
      severity: "error",
      file: allowlistConfig.path
        ? normalizePath(relative(projectRoot, allowlistConfig.path))
        : ".deslop-audit.json",
      line: 1,
      column: 1,
      message: error,
      evidence: "",
    })
  }

  const packagePath = resolve(projectRoot, "package.json")
  if (await exists(packagePath)) {
    const packageJson = JSON.parse(await readFile(packagePath, "utf8"))
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
      ...packageJson.peerDependencies,
    }
    for (const dependency of Object.keys(dependencies)) {
      const forbidden = DIRECT_UI_PACKAGES.find(({ pattern }) => pattern.test(dependency))
      if (!forbidden) continue
      findings.push({
        rule: "direct-ui-dependency",
        area: "components",
        severity: "error",
        file: "package.json",
        line: 1,
        column: 1,
        message: `${dependency} is a direct dependency; consume ${forbidden.name} through Deslop`,
        evidence: dependency,
      })
    }
  }

  for (const path of files) {
    const file = normalizePath(relative(projectRoot, path))
    const source = maskComments(await readFile(path, "utf8"))
    if (/(?:^|\/)components\/ui\//.test(file)) {
      findings.push(
        makeFinding({
          rule: "local-ui-module",
          file,
          source,
          message: `${file} creates an unverified local UI layer outside Deslop`,
        }),
      )
    }

    if (CODE_EXTENSIONS.has(extname(path))) auditCode({ findings, file, source })
    else auditStyles({ findings, file, source })
  }

  const unique = [
    ...new Map(
      findings.map((finding) => [
        [finding.rule, finding.file, finding.line, finding.column, finding.message].join(":"),
        finding,
      ]),
    ).values(),
  ].sort(sortFindings)
  const violations = []
  const allowed = []

  for (const finding of unique) {
    const allowance = allowanceFor(finding, allowlistConfig.entries)
    if (allowance && finding.rule !== "allowlist-invalid") {
      allowed.push({
        ...finding,
        allowance: {
          reason: allowance.reason,
          owner: allowance.owner,
          expires: allowance.expires,
        },
      })
    } else violations.push(finding)
  }

  const ok = violations.length === 0
  return {
    schemaVersion: 1,
    root: projectRoot,
    strict,
    ok,
    pass: strict ? ok : true,
    scannedFiles: files.length,
    sourceRoots: runtimeRoots.map((path) => normalizePath(relative(projectRoot, path) || ".")),
    summary: summarize(violations, allowed),
    violations,
    allowed,
  }
}

export function formatHumanReport(result) {
  const lines = [
    "Deslop adoption audit",
    `Root: ${result.root}`,
    `Scanned: ${result.scannedFiles} runtime files`,
    "",
  ]

  for (const area of AREA_ORDER) {
    const count = result.summary.byArea[area] ?? 0
    lines.push(`${area.padEnd(14)} ${count === 0 ? "PASS" : `FAIL (${count})`}`)
  }

  if (result.violations.length > 0) {
    lines.push("", "Violations:")
    for (const finding of result.violations) {
      lines.push(
        `- [${finding.rule}] ${finding.file}:${finding.line}:${finding.column} ${finding.message}`,
      )
      if (finding.evidence) lines.push(`  ${finding.evidence}`)
    }
  }

  if (result.allowed.length > 0) {
    lines.push("", `Allowed exceptions (${result.allowed.length}):`)
    for (const finding of result.allowed) {
      lines.push(
        `- [${finding.rule}] ${finding.file}:${finding.line} — ${finding.allowance.reason}`,
      )
    }
  }

  lines.push("", result.ok ? "PASS" : result.strict ? "FAIL" : "REPORT ONLY")
  return `${lines.join("\n")}\n`
}

const optionValue = (args, name) => {
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : undefined
}

const optionValues = (args, name) => {
  const values = []
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === name && args[index + 1]) values.push(args[index + 1])
  }
  return values
}

const writeOutput = (target, value) => {
  if (typeof target === "function") target(value)
  else target?.write?.(value)
}

export async function runAudit({
  cwd = process.cwd(),
  args = process.argv.slice(2),
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  const auditArgs = args[0] === "audit" ? args.slice(1) : args
  if (auditArgs.includes("--help") || auditArgs.includes("-h")) {
    writeOutput(
      stdout,
      "Usage: deslop audit [--cwd <path>] [--strict] [--json] [--allowlist <path>] [--source <path>]\n",
    )
    return { exitCode: 0, help: true }
  }

  try {
    const requestedCwd = optionValue(auditArgs, "--cwd")
    const allowlist = optionValue(auditArgs, "--allowlist")
    const sources = optionValues(auditArgs, "--source")
    const strict = auditArgs.includes("--strict")
    const result = await auditProject({
      cwd: requestedCwd ? resolve(cwd, requestedCwd) : cwd,
      strict,
      allowlist,
      sourceRoots: sources.length > 0 ? sources : undefined,
    })
    writeOutput(
      stdout,
      auditArgs.includes("--json")
        ? `${JSON.stringify(result, null, 2)}\n`
        : formatHumanReport(result),
    )
    return { ...result, exitCode: strict && !result.ok ? 1 : 0 }
  } catch (error) {
    writeOutput(stderr, `Deslop audit failed: ${error.message}\n`)
    return { ok: false, pass: false, exitCode: 2, error: error.message }
  }
}

const isMain =
  process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url

if (isMain) {
  const result = await runAudit()
  process.exitCode = result.exitCode
}
