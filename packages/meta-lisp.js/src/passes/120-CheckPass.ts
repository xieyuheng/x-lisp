import * as M from "../meta/index.ts"
import * as Pkg from "../package/index.ts"

// CheckPass is a type-checking pass: it elaborates M.Term → M.Term
// via type-checking, eliminating TheTerm and populating type information
// in mod.inferredTypes. The elaborated bodies are stored directly
// in definition.body by definitionCheck.

export function CheckPass(pkg: Pkg.Package): M.Outcome {
  let outcome: M.Outcome = "OutcomeOk"

  for (const mod of pkg.mods.values()) {
    for (const definition of mod.definitions.values()) {
      if (M.definitionCheck(definition) === "OutcomeError")
        outcome = "OutcomeError"
    }
  }

  if (pkg.config.compiler.dump) {
    Pkg.packageDumpMods(pkg, "120-check")
  }

  return outcome
}
