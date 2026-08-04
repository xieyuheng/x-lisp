import * as C from "../../core/index.ts"
import * as M from "../../meta/index.ts"

// - although after QualifyPass, CheckPass still need to handle unqualified Var,
//   which is used by by inferring type of recursive function.
//
// - CheckPass is a translation pass: it elaborates M.Term → C.Term
//   via type-checking, and populates pkg.coreMods with C.Mod.

export function CheckPass(pkg: M.Package): M.Outcome {
  let outcome: M.Outcome = "OutcomeOk"

  for (const mod of pkg.mods.values()) {
    const coreMod = C.createMod(mod.name, pkg)

    for (const definition of mod.definitions.values()) {
      if (M.definitionCheck(definition) === "OutcomeError")
        outcome = "OutcomeError"

      const coreDefinition = elaborateDefinition(coreMod, definition)
      if (coreDefinition) {
        C.modDefine(coreMod, definition.name, coreDefinition)
      }
    }

    pkg.coreMods.set(coreMod.name, coreMod)
  }

  if (pkg.config.compiler.dump) {
    M.packageDumpCoreMods(pkg, "120-check")
  }

  return outcome
}

// elaborateDefinition translates a meta-layer M.Definition into a
// core-layer C.Definition. It reads the elaborated C.Term (stored by
// definitionCheck during type-checking) via modLookupCoreTerm.
//
// Returns undefined when the definition does not produce code at the
// core layer — either because the definition kind is not code-generating,
// or because type-checking failed and no elaborated body was stored.

function elaborateDefinition(
  coreMod: C.Mod,
  definition: M.Definition,
): C.Definition | undefined {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      return C.PrimitiveFunctionDeclaration(
        coreMod,
        definition.name,
        definition.arity,
        definition.location,
      )
    }

    case "PrimitiveVariableDeclaration": {
      return C.PrimitiveVariableDeclaration(
        coreMod,
        definition.name,
        definition.location,
      )
    }

    case "FunctionDefinition": {
      const coreTerm = M.modLookupCoreTerm(definition.mod, definition.name)
      if (!coreTerm) return undefined
      return C.FunctionDefinition(
        coreMod,
        definition.name,
        definition.parameters,
        coreTerm,
        definition.location,
      )
    }

    case "VariableDefinition": {
      const coreTerm = M.modLookupCoreTerm(definition.mod, definition.name)
      if (!coreTerm) return undefined
      return C.VariableDefinition(
        coreMod,
        definition.name,
        coreTerm,
        definition.location,
      )
    }

    case "TestDefinition": {
      const coreTerm = M.modLookupCoreTerm(definition.mod, definition.name)
      if (!coreTerm) return undefined
      return C.TestDefinition(
        coreMod,
        definition.name,
        coreTerm,
        definition.location,
      )
    }

    case "TypeDefinition":
    case "AlgebraicTypeDefinition":
    case "OpaqueTypeDefinition": {
      return undefined
    }
  }
}
