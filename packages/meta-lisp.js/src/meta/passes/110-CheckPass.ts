import * as M from "../index.ts"

// - although after QualifyPass, CheckPass still need to handle unqualified Var,
//   which is used by by inferring type of recursive function.

export function CheckPass(rootPkg: M.Package): boolean {
  let errorOccurred = false

  for (const pkg of M.packageClosureInTopologicalOrder(rootPkg)) {
    for (const mod of pkg.mods.values()) {
      for (const definition of mod.definitions.values()) {
        if (M.definitionCheck(definition)) errorOccurred = true
      }
    }
  }

  if (rootPkg.config.compiler.dump) M.packageDumpMods(rootPkg, "110-check")

  return errorOccurred
}
