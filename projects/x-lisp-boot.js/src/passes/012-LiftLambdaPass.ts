import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import * as L from "../index.ts"

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

      return L.makeCurry(
        L.FunctionRef(newFunctionName, arity, { isPrimitive: false }),
        arity,
        freeNames.map((name) => L.Var(name)),
      )
    }

    case "Apply": {
      return L.Apply(onExp(state, exp.target), onExp(state, exp.arg), exp.meta)
    }

    case "ApplyNullary": {
      return L.ApplyNullary(onExp(state, exp.target), exp.meta)
    }

    case "Let1": {
      return L.Let1(
        exp.name,
        onExp(state, exp.rhs),
        onExp(state, exp.body),
        exp.meta,
      )
    }

    case "If": {
      return L.If(
        onExp(state, exp.condition),
        onExp(state, exp.consequent),
        onExp(state, exp.alternative),
        exp.meta,
      )
    }

    default: {
      let message = `[LiftLambdaPass] unhandled exp`
      message += `\n  exp: ${L.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}
