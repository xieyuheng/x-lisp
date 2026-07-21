import fs from "node:fs"
import Path from "node:path"
import * as M from "../index.ts"

// - although after QualifyPass, CheckPass still need to handle unqualified Var,
//   which is used by by inferring type of recursive function.

export function CheckPass(pkg: M.Package): M.Outcome {
  let outcome: M.Outcome = "OutcomeOk"

  for (const mod of pkg.mods.values()) {
    for (const definition of mod.definitions.values()) {
      if (M.definitionCheck(definition) === "OutcomeError")
        outcome = "OutcomeError"
    }
  }

  if (pkg.config.compiler.dump) {
    M.packageDumpMods(pkg, "120-check")
    dumpModsCheckVarTypes(pkg)
  }

  return outcome
}

function dumpModsCheckVarTypes(pkg: M.Package): void {
  const dir = Path.join(M.packageOutputDirectory(pkg), "dump/modules")

  for (const mod of pkg.mods.values()) {
    const content = formatModCheckVarTypes(mod.definitions)
    if (content === "") continue

    fs.mkdirSync(dir, { recursive: true })
    const file = Path.join(dir, `${mod.name}.120-check-var-types.dump`)
    fs.writeFileSync(file, content + "\n", "utf-8")
  }
}

function formatModCheckVarTypes(
  definitions: Map<string, M.Definition>,
): string {
  const lines: Array<string> = []
  lines.push("(check-var-types")

  for (const definition of definitions.values()) {
    const varTypes = M.definitionVarTypes(definition)
    if (!varTypes || varTypes.size === 0) continue

    lines.push(`  (${definition.name}`)
    for (const [name, type] of [...varTypes].sort((a, b) => cmp(a[0], b[0]))) {
      lines.push(`    (${name} ${M.formatType(type)})`)
    }
    closeTop(lines)
  }

  if (lines.length === 1) return ""
  closeTop(lines)
  return lines.join("\n")
}

function closeTop(lines: Array<string>): void {
  const i = lines.length - 1
  lines[i] = lines[i] + ")"
}

function cmp(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}
