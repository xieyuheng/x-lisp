import * as C from "../core/index.ts"
import * as M from "../meta/index.ts"
import * as Pkg from "../package/index.ts"

// - although after QualifyPass, CheckPass still need to handle unqualified Var,
//   which is used by by inferring type of recursive function.
//
// - CheckPass is a translation pass: it elaborates M.Term → C.Term
//   via type-checking, and populates pkg.coreMods with C.Mod.

export function CheckPass(pkg: Pkg.Package): M.Outcome {
  let outcome: M.Outcome = "OutcomeOk"

  for (const mod of pkg.mods.values()) {
    const coreMod = C.createMod(mod.name, pkg)

    for (const definition of mod.definitions.values()) {
      if (M.definitionCheck(definition) === "OutcomeError")
        outcome = "OutcomeError"

      const coreDefinition = C.elaborateDefinition(coreMod, definition)
      if (coreDefinition) {
        C.modDefine(coreMod, definition.name, coreDefinition)
      }
    }

    pkg.coreMods.set(coreMod.name, coreMod)
  }

  if (pkg.config.compiler.dump) {
    Pkg.packageDumpMods(pkg, "120-check")
  }

  return outcome
}
