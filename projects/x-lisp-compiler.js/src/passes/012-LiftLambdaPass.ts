import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import assert from "node:assert"
import * as L from "../lisp/index.ts"

export function LiftLambdaPass(mod: L.Mod): void {
  mod.definitions = new Map(
    L.modOwnDefinitions(mod)
      .flatMap((definition) => onDefinition(mod, definition))
      .map((definition) => [definition.name, definition]),
  )
}

type State = {
  mod: L.Mod
  lifted: Array<L.Definition>
  definition: L.Definition
}

function onDefinition(
  mod: L.Mod,
  definition: L.Definition,
): Array<L.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition":
    case "PrimitiveConstantDefinition": {
      return [definition]
    }

    case "FunctionDefinition":
    case "ConstantDefinition": {
      const lifted: Array<L.Definition> = []
      const state = { mod, lifted, definition }
      definition.body = onExp(state, definition.body)
      return [
        definition,
        ...lifted.flatMap((definition) => onDefinition(mod, definition)),
      ]
    }
  }
}

function onExp(state: State, exp: L.Exp): L.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "PrimitiveFunctionRef":
    case "PrimitiveConstantRef":
    case "FunctionRef":
    case "ConstantRef":
    case "Var": {
      return exp
    }

    case "Lambda": {
      const freeNames = Array.from(L.expFreeNames(new Set(), exp))
      const liftedCount = state.lifted.length + 1
      const subscript = stringToSubscript(liftedCount.toString())
      const newFunctionName = `${state.definition.name}©λ${subscript}`
      const newParameters = [...freeNames, ...exp.parameters]
      const arity = newParameters.length
      assert(exp.meta)
      state.lifted.push(
        L.FunctionDefinition(
          state.mod,
          newFunctionName,
          newParameters,
          exp.body,
          exp.meta,
        ),
      )

      if (freeNames.length == 0) {
        return L.FunctionRef(newFunctionName, arity)
      } else {
        return L.Apply(
          L.FunctionRef(newFunctionName, arity),
          freeNames.map((name) => L.Var(name)),
        )
      }
    }

    default: {
      return L.expMap((e) => onExp(state, e), exp)
    }
  }
}
