import assert from "node:assert"
import * as M from "../index.ts"

export function LiftLambdaPass(mod: M.Mod): void {
  mod.definitions = new Map(
    M.modOwnDefinitions(mod)
      .flatMap((definition) => onDefinition(mod, definition))
      .map((definition) => [definition.name, definition]),
  )
}

type State = {
  mod: M.Mod
  lifted: Array<M.Definition>
  definition: M.Definition
}

function onDefinition(
  mod: M.Mod,
  definition: M.Definition,
): Array<M.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition":
    case "DataDefinition":
    case "InterfaceDefinition": {
      return [definition]
    }

    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition":
    case "TypeDefinition": {
      const lifted: Array<M.Definition> = []
      const state = { mod, lifted, definition }
      definition.body = onExp(state, definition.body)
      return [
        definition,
        ...lifted.flatMap((definition) => onDefinition(mod, definition)),
      ]
    }
  }
}

function onExp(state: State, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "QualifiedVar":
    case "Var": {
      return exp
    }

    case "Lambda": {
      const freeNames = Array.from(M.expFreeNames(new Set(), exp))
      const liftedCount = state.lifted.length + 1
      const newFunctionName = `${state.definition.name}©λ${liftedCount}`
      const newParameters = [...freeNames, ...exp.parameters]
      const arity = newParameters.length
      assert(exp.location)
      state.lifted.push(
        M.FunctionDefinition(
          state.mod,
          newFunctionName,
          newParameters,
          exp.body,
          exp.location,
        ),
      )

      const qualifiedFunctionName = `${state.mod.name}/${newFunctionName}`

      if (freeNames.length == 0) {
        return M.Var(qualifiedFunctionName)
      } else {
        return M.Apply(
          M.Var(qualifiedFunctionName),
          freeNames.map((name) => M.Var(name)),
        )
      }
    }

    default: {
      return M.expTraverse((e) => onExp(state, e), exp)
    }
  }
}
