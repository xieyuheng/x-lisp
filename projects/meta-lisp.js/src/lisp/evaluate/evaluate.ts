import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"
import { apply } from "./apply.ts"

export function evaluate(mod: L.Mod, env: L.Env, exp: L.Exp): L.Value {
  switch (exp.kind) {
    case "Symbol": {
      return L.SymbolValue(exp.content)
    }

    case "Keyword": {
      return L.KeywordValue(exp.content)
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
      if (definition) return L.definitionMeaning(definition)

      let message = `[evaluate] undefined variable`
      message += `\n  name: ${exp.name}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }

    case "Require": {
      const importedMod = L.importBy(exp.path, mod)
      const definition = L.modLookupPublicDefinition(importedMod, exp.name)
      if (definition) return L.definitionMeaning(definition)

      let message = `[evaluate] undefined require name`
      message += `\n  path: ${exp.path}`
      message += `\n  name: ${exp.name}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }

    case "Lambda": {
      return L.ClosureValue(mod, env, exp.parameters, exp.body)
    }

    case "Polymorphic": {
      const varTypes = exp.parameters.map((parameter) =>
        L.createVarType(parameter, BigInt(0)),
      )
      const bodyType = evaluate(
        mod,
        L.envPutMany(env, exp.parameters, varTypes),
        exp.body,
      )
      return L.createPolymorphicType(varTypes, bodyType)
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

    case "If": {
      const conditionValue = evaluate(mod, env, exp.condition)
      if (L.isTrueValue(conditionValue)) {
        return evaluate(mod, env, exp.consequent)
      } else {
        return evaluate(mod, env, exp.alternative)
      }
    }

    case "LiteralTuple": {
      return L.ListValue(exp.elements.map((e) => evaluate(mod, env, e)))
    }

    case "LiteralRecord": {
      return L.RecordValue(
        recordMapValue(exp.attributes, (attribute) =>
          evaluate(mod, env, attribute),
        ),
      )
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

      return L.createTauType(elementTypes)
    }

    case "Interface": {
      const attributeTypes = recordMapValue(
        exp.attributeTypes,
        (attributeType) => evaluate(mod, env, attributeType),
      )
      return L.createInterfaceType(attributeTypes)
    }

    case "ExtendInterface": {
      const baseType = evaluate(mod, env, exp.baseType)
      const attributeTypes = recordMapValue(
        exp.attributeTypes,
        (attributeType) => evaluate(mod, env, attributeType),
      )
      return L.createExtendInterfaceType(baseType, attributeTypes)
    }

    case "Extend": {
      const base = evaluate(mod, env, exp.base)
      if (!L.isRecordValue(base)) {
        let message = `[evaluate] can only extend record base value`
        message += `\n  base value kind: ${base.kind}`
        message += `\n  base value: ${L.formatValue(base)}`
        if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
        else throw new Error(message)
      }

      const attributes = recordMapValue(
        exp.attributes,
        (attribute) => evaluate(mod, env, attribute),
      )
      return L.RecordValue({ ...base.attributes, ...attributes })
    }

    case "The": {
      return evaluate(mod, env, exp.exp)
    }

    default: {
      let message = `[evaluate] unhandled exp`
      message += `\n  exp kind: ${exp.kind}`
      message += `\n  exp: ${L.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}
