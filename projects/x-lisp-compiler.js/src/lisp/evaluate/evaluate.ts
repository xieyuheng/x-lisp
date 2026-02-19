import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"
import { meaning } from "./meaning.ts"

export function evaluate(mod: L.Mod, env: L.Env, exp: L.Exp): [L.Env, L.Value] {
  switch (exp.kind) {
    case "Symbol": {
      return [env, L.SymbolValue(exp.content)]
    }

    case "Hashtag": {
      return [env, L.HashtagValue(exp.content)]
    }

    case "String": {
      return [env, L.StringValue(exp.content)]
    }

    case "Int": {
      return [env, L.IntValue(exp.content)]
    }

    case "Float": {
      return [env, L.FloatValue(exp.content)]
    }

    case "Var": {
      const value = L.envLookupValue(env, exp.name)
      if (value) return [env, value]

      const definition = L.modLookupDefinition(mod, exp.name)
      if (definition) return [env, meaning(definition)]

      let message = `[evaluate] undefined`
      message += `\n  name: ${exp.name}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }

    case "Lambda": {
      return [env, L.ClosureValue(mod, env, exp.parameters, exp.body)]
    }

    case "Apply": {
      throw new Error("TODO")
    }

    case "Let1": {
      const [rhsEnv, rhsValue] = evaluate(mod, env, exp.rhs)
      return evaluate(mod, L.envPut(rhsEnv, exp.name, rhsValue), exp.body)
    }

    case "Begin1": {
      const [headEnv, _] = evaluate(mod, env, exp.head)
      return evaluate(mod, headEnv, exp.body)
    }

    case "BeginSugar": {
      let lastEnv = env
      let lastValue: L.Value = L.VoidValue()
      for (const subExp of exp.sequence) {
        const [subEnv, subValue] = evaluate(mod, lastEnv, subExp)
        lastEnv = subEnv
        lastValue = subValue
      }

      return [lastEnv, lastValue]
    }

    case "AssignSugar": {
      const [rhsEnv, rhsValue] = evaluate(mod, env, exp.rhs)
      return [L.envPut(rhsEnv, exp.name, rhsValue), L.VoidValue()]
    }

    case "If": {
      const [conditionEnv, conditionValue] = evaluate(mod, env, exp.condition)
      if (L.isTrueValue(conditionValue)) {
        return evaluate(mod, conditionEnv, exp.consequent)
      } else {
        return evaluate(mod, conditionEnv, exp.alternative)
      }
    }

    case "When": {
      return evaluate(mod, env, L.If(exp.condition, exp.consequent, L.Void()))
    }

    case "Unless": {
      return evaluate(mod, env, L.If(exp.condition, L.Void(), exp.consequent))
    }

    case "And": {
      throw new Error("TODO")
    }

    case "Or": {
      throw new Error("TODO")
    }

    case "Cond": {
      throw new Error("TODO")
    }

    case "Tael": {
      throw new Error("TODO")
    }

    case "Set": {
      throw new Error("TODO")
    }

    case "Hash": {
      throw new Error("TODO")
    }

    case "Quote": {
      throw new Error("TODO")
    }
  }
}
