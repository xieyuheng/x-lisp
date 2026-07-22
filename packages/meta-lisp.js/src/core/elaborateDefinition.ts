import * as M from "../meta/index.ts"
import * as C from "./index.ts"

// elaborateDefinition translates a meta-layer M.Definition into a
// core-layer C.Definition. It reads the elaborated C.Term (stored by
// definitionCheck during type-checking) via modLookupCoreTerm.
//
// Returns undefined when the definition does not produce code at the
// core layer — either because the definition kind is not code-generating,
// or because type-checking failed and no elaborated body was stored.

export function elaborateDefinition(
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
      // - why: type-checking may have failed for this definition,
      //   so no coreTerm was stored. The error was already printed
      //   during definitionCheck.
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
      // - why: these definition kinds are type-level only and do not
      //   generate code at the core layer.
      return undefined
    }
  }
}
