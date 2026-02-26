import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"
import { apply } from "./apply.ts"
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

    case "Polymorphic": {
      return L.createPolymorphicType(
        exp.parameters,
        L.ClosureValue(mod, env, exp.parameters, exp.body),
      )
    }

    case "Apply": {
      const target = evaluate(mod, env, exp.target)
      const args = exp.args.map((arg) => evaluate(mod, env, arg))
      return apply(target, args)
    }

    case "Let1": {
      const rhsValue = evaluate(mod, env, exp.rhs)
      return evaluate(mod, L.envPut(env, exp.name, rhsValue), exp.body)
    }

    case "Begin1": {
      evaluate(mod, env, exp.head)
      return evaluate(mod, env, exp.body)
    }

    case "BeginSugar": {
      return evaluate(mod, env, L.desugarBegin(exp.sequence))
    }

    case "AssignSugar": {
      let message = `[evaluate] unhandled exp`
      message += `\n  exp: ${L.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }

    case "If": {
      const conditionValue = evaluate(mod, env, exp.condition)
      if (L.isTrueValue(conditionValue)) {
        return evaluate(mod, env, exp.consequent)
      } else {
        return evaluate(mod, env, exp.alternative)
      }
    }

    case "When": {
      return evaluate(mod, env, L.desugarWhen(exp))
    }

    case "Unless": {
      return evaluate(mod, env, L.desugarUnless(exp))
    }

    case "And": {
      return evaluate(mod, env, L.desugarAnd(exp.exps))
    }

    case "Or": {
      return evaluate(mod, env, L.desugarOr(exp.exps))
    }

    case "Cond": {
      return evaluate(mod, env, L.desugarCond(exp.condLines))
    }

    case "Tael": {
      return evaluate(mod, env, L.desugarTael(exp.elements, exp.attributes))
    }

    case "Set": {
      return evaluate(mod, env, L.desugarSet(exp.elements))
    }

    case "Hash": {
      return evaluate(mod, env, L.desugarHash(exp.entries))
    }

    case "Quote": {
      return evaluate(mod, env, L.desugarQuote(exp.sexp))
    }

    case "Arrow": {
      const argTypes = exp.argTypes.map((argType) =>
        evaluate(mod, env, argType),
      )
      const retType = evaluate(mod, env, exp.retType)
      return L.createArrowType(argTypes, retType)
    }

    case "Tau": {
      const elementTypes = exp.elementTypes.map((elementType) =>
        evaluate(mod, env, elementType),
      )
      const attributeTypes = recordMapValue(
        exp.attributeTypes,
        (attributeType) => evaluate(mod, env, attributeType),
      )
      return L.createTauType(elementTypes, attributeTypes)
    }

    case "The": {
      return evaluate(mod, env, exp.exp)
    }
  }
}
