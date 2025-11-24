import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import * as X from "../index.ts"

export function LiftLambdaPass(mod: X.Mod): void {
  mod.definitions = new Map(
    X.modOwnDefinitions(mod)
      .flatMap((definition) => onDefinition(mod, definition))
      .map((definition) => [definition.name, definition]),
  )
}

type State = {
  mod: X.Mod
  lifted: Array<X.Definition>
  definition: X.FunctionDefinition
}

function onDefinition(
  mod: X.Mod,
  definition: X.Definition,
): Array<X.Definition> {
  switch (definition.kind) {
    case "FunctionDefinition": {
      const lifted: Array<X.Definition> = []
      const state = { mod, lifted, definition }
      definition.body = onExp(state, definition.body)
      return [
        definition,
        ...lifted.flatMap((definition) => onDefinition(mod, definition)),
      ]
    }
  }
}

function onExp(state: State, exp: X.Exp): X.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "Function":
    case "Var": {
      return exp
    }

    case "Lambda": {
      const freeNames = Array.from(X.expFreeNames(new Set(), exp))
      const liftedCount = state.lifted.length + 1
      const subscript = stringToSubscript(liftedCount.toString())
      const newFunctionName = `${state.definition.name}/λ${subscript}`
      const newParameters = [...freeNames, ...exp.parameters]
      const arity = newParameters.length
      assert(exp.meta)
      state.lifted.push(
        X.FunctionDefinition(
          state.mod,
          newFunctionName,
          newParameters,
          exp.body,
          exp.meta,
        ),
      )

      return X.makeCurry(
        X.Function(newFunctionName, arity, { isPrimitive: false }),
        arity,
        freeNames.map((name) => X.Var(name)),
      )
    }

    case "Apply": {
      return X.Apply(onExp(state, exp.target), onExp(state, exp.arg), exp.meta)
    }

    case "NullaryApply": {
      return X.NullaryApply(onExp(state, exp.target), exp.meta)
    }

    case "Let1": {
      return X.Let1(
        exp.name,
        onExp(state, exp.rhs),
        onExp(state, exp.body),
        exp.meta,
      )
    }

    case "If": {
      return X.If(
        onExp(state, exp.condition),
        onExp(state, exp.consequent),
        onExp(state, exp.alternative),
        exp.meta,
      )
    }

    default: {
      let message = `[LiftLambdaPass] unhandled exp`
      message += `\n  exp: ${X.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}
