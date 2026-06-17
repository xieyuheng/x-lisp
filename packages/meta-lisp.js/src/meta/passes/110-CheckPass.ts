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

  if (pkg.config.compiler.dump) M.packageDumpMods(pkg, "110-check")

  return outcome
}
