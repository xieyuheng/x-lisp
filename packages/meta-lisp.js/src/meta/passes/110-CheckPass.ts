import * as M from "../index.ts"

// - although after QualifyPass, CheckPass still need to handle unqualified Var,
//   which is used by by inferring type of recursive function.

export function CheckPass(pkg: M.Package): boolean {
  let errorOccurred = false

  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const mod of orderedPkg.mods.values()) {
      for (const definition of mod.definitions.values()) {
        if (M.definitionCheck(definition)) errorOccurred = true
      }
    }
  }

  if (pkg.config.compiler.dump) M.packageDumpMods(pkg, "110-check")

  return errorOccurred
}
