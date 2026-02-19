import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"
import { meaning } from "./meaning.ts"

export function evaluate(mod: L.Mod, env: L.Env, exp: L.Exp): L.Value {
  switch (exp.kind) {
    case "Symbol": {
      return L.SymbolValue(exp.content)
    }

    case "Hashtag": {
      return L.HashtagValue(exp.content)
    }

    case "String": {
      return L.StringValue(exp.content)
    }

    case "Int": {
      return L.IntValue(exp.content)
    }

    case "Float": {
      return L.FloatValue(exp.content)
    }

    case "Var": {
      const value = L.envLookupValue(env, exp.name)
      if (value) return value

      const definition = L.modLookupDefinition(mod, exp.name)
      if (definition) return meaning(definition)

      let message = `[evaluate] undefined`
      message += `\n  name: ${exp.name}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }

    case "Lambda": {
      return L.ClosureValue(mod, env, exp.parameters, exp.body)
    }

    case "Apply": {
      throw new Error("TODO")
    }

    case "Let1": {
      throw new Error("TODO")
    }

    case "Begin1": {
      throw new Error("TODO")
    }

    case "BeginSugar": {
      throw new Error("TODO")
    }

    case "AssignSugar": {
      throw new Error("TODO")
    }

    case "If": {
      throw new Error("TODO")
    }

    case "When": {
      throw new Error("TODO")
    }

    case "Unless": {
      throw new Error("TODO")
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
