import * as M from "../index.ts"

// - although after QualifyPass, CheckPass still need to handle unqualified Var,
//   which is used by by inferring type of recursive function.

export function CheckPass(pkg: M.Package, options: Map<string, string>): void {
  for (const mod of pkg.mods.values()) {
    for (const definition of mod.definitions.values()) {
      M.definitionCheck(definition)
    }
  }

  if (options.has("dump")) M.packageDumpMods(pkg, "110-check")
}
