import * as M from "../meta/index.ts"
import * as C from "./index.ts"

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
