import path from "node:path"

import { runDoctor } from "./doctor.mjs"
import { formatMigrationReport, migrateProject } from "./migrate.mjs"

const usage = `Deslop design-system CLI

Usage:
  deslop doctor [--cwd <project>] [--output <deslop-plan.json>]
  deslop migrate [--cwd <project>] [--dry-run] [--registry <file>] [--json]
  deslop audit [--cwd <project>] [--strict] [--json] [--allowlist <file>]

Commands:
  doctor   Inspect compatibility and print a migration plan without changing the project.
  migrate  Apply registry-backed, unambiguous import migrations.
  audit    Check Deslop adoption and fail strict runs when violations remain.
`

function parseOptions(args, { values = [], booleans = [] } = {}) {
  const valueOptions = new Set(values)
  const booleanOptions = new Set(booleans)
  const options = {}

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (!argument.startsWith("--")) {
      throw new Error(`Unexpected argument: ${argument}`)
    }

    const [rawName, inlineValue] = argument.slice(2).split(/=(.*)/s, 2)
    if (booleanOptions.has(rawName)) {
      if (inlineValue !== undefined) {
        throw new Error(`--${rawName} does not accept a value`)
      }
      options[rawName] = true
      continue
    }

    if (!valueOptions.has(rawName)) {
      throw new Error(`Unknown option: --${rawName}`)
    }

    const value = inlineValue ?? args[++index]
    if (!value || value.startsWith("--")) {
      throw new Error(`--${rawName} requires a value`)
    }
    options[rawName] = value
  }

  return options
}

function violationCount(result) {
  if (Array.isArray(result?.violations)) return result.violations.length
  if (Number.isFinite(result?.summary?.violations)) return result.summary.violations
  if (Number.isFinite(result?.summary?.total)) return result.summary.total
  return 0
}

async function runAuditCommand(options, io) {
  let auditModule

  try {
    auditModule = await import("./audit.mjs")
  } catch (error) {
    if (error.code === "ERR_MODULE_NOT_FOUND") {
      throw new Error("Audit implementation is not included in this build.")
    }
    throw error
  }

  if (typeof auditModule.auditProject !== "function") {
    throw new Error("Audit module must export auditProject().")
  }

  const result = await auditModule.auditProject({
    cwd: options.cwd,
    strict: options.strict,
    allowlist: options.allowlist,
  })

  if (options.json) {
    io.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
  } else if (typeof auditModule.formatHumanReport === "function") {
    io.stdout.write(auditModule.formatHumanReport(result))
  } else {
    io.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
  }

  const failed =
    result?.pass === false ||
    result?.ok === false ||
    (options.strict && violationCount(result) > 0)
  return failed ? 1 : 0
}

export async function runCli(
  argv,
  {
    cwd = process.cwd(),
    stdout = process.stdout,
    stderr = process.stderr,
  } = {},
) {
  const [command, ...args] = argv
  const io = { stdout, stderr }

  if (!command || command === "help" || command === "--help" || command === "-h") {
    stdout.write(usage)
    return 0
  }
  if (command === "--version" || command === "-v") {
    stdout.write("0.1.0\n")
    return 0
  }

  if (command === "doctor") {
    const options = parseOptions(args, {
      values: ["cwd", "output"],
      booleans: ["help"],
    })
    if (options.help) {
      stdout.write(usage)
      return 0
    }

    await runDoctor({
      cwd: path.resolve(cwd, options.cwd ?? "."),
      output: options.output,
      stdout,
    })
    return 0
  }

  if (command === "migrate") {
    const options = parseOptions(args, {
      values: ["cwd", "registry"],
      booleans: ["dry-run", "json", "help"],
    })
    if (options.help) {
      stdout.write(usage)
      return 0
    }

    const projectRoot = path.resolve(cwd, options.cwd ?? ".")
    const result = await migrateProject({
      cwd: projectRoot,
      dryRun: Boolean(options["dry-run"]),
      registryPath: options.registry
        ? path.resolve(cwd, options.registry)
        : undefined,
    })
    stdout.write(
      options.json
        ? `${JSON.stringify(result, null, 2)}\n`
        : formatMigrationReport(result),
    )
    return 0
  }

  if (command === "audit") {
    const options = parseOptions(args, {
      values: ["cwd", "allowlist"],
      booleans: ["strict", "json", "help"],
    })
    if (options.help) {
      stdout.write(usage)
      return 0
    }

    return runAuditCommand(
      {
        cwd: path.resolve(cwd, options.cwd ?? "."),
        strict: Boolean(options.strict),
        json: Boolean(options.json),
        allowlist: options.allowlist
          ? path.resolve(cwd, options.allowlist)
          : undefined,
      },
      io,
    )
  }

  throw new Error(`Unknown command: ${command}`)
}

export async function main(argv, io) {
  try {
    return await runCli(argv, io)
  } catch (error) {
    const stderr = io?.stderr ?? process.stderr
    stderr.write(`deslop: ${error.message}\n`)
    return 2
  }
}

export { usage }
