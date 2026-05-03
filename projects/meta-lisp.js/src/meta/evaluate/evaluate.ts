import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { apply } from "./apply.ts"

export function evaluate(mod: M.Mod, env: M.Env, exp: M.Exp): M.Value {
  switch (exp.kind) {
    case "Symbol": {
      return M.SymbolValue(exp.content)
    }

    case "Keyword": {
      return M.KeywordValue(exp.content)
    }

    case "String": {
      return M.StringValue(exp.content)
    }

    case "Int": {
      return M.IntValue(exp.content)
    }

    case "Float": {
      return M.FloatValue(exp.content)
    }

    case "Var": {
      const value = M.envLookupValue(env, exp.name)
      if (value) return value

      let message = `[evaluate] undefined variable`
      message += `\n  name: ${exp.name}`
      if (exp.location)
        throw new S.ErrorWithSourceLocation(message, exp.location)
      else throw new Error(message)
    }

    case "QualifiedVar": {
      const qualifiedMod = M.projectLookupMod(mod.project, exp.modName)
      if (qualifiedMod === undefined) {
        let message = `[evaluate] undefined module prefix`
        message += `\n  name: ${exp.modName}/${exp.name}`
        if (exp.location)
          throw new S.ErrorWithSourceLocation(message, exp.location)
        else throw new Error(message)
      }

      const definition = M.modLookupDefinition(qualifiedMod, exp.name)
      if (definition) return M.definitionMeaning(definition)

      let message = `[evaluate] undefined qualified variable`
      message += `\n  name: ${exp.modName}/${exp.name}`
      if (exp.location)
        throw new S.ErrorWithSourceLocation(message, exp.location)
      else throw new Error(message)
    }

    case "Lambda": {
      return M.ClosureValue(mod, env, exp.parameters, exp.body)
    }

    case "Polymorphic": {
      const varTypes = exp.parameters.map((parameter) =>
        M.createVarType(parameter, BigInt(0)),
      )
      const bodyType = evaluate(
        mod,
        M.envPutMany(env, exp.parameters, varTypes),
        exp.body,
      )
      return M.createPolymorphicType(varTypes, bodyType)
    }

    case "Apply": {
      const target = evaluate(mod, env, exp.target)
      const args = exp.args.map((arg) => evaluate(mod, env, arg))
      return apply(target, args)
    }

    case "Let1": {
      const rhsValue = evaluate(mod, env, exp.rhs)
      return evaluate(mod, M.envPut(env, exp.name, rhsValue), exp.body)
    }

    case "Begin1": {
      evaluate(mod, env, exp.head)
      return evaluate(mod, env, exp.body)
    }

    case "If": {
      const conditionValue = evaluate(mod, env, exp.condition)
      if (M.isTrueValue(conditionValue)) {
        return evaluate(mod, env, exp.consequent)
      } else {
        return evaluate(mod, env, exp.alternative)
      }
    }

    case "LiteralRecord": {
      return M.RecordValue(
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
      return M.createArrowType(argTypes, retType)
    }

    case "Interface": {
      const attributeTypes = recordMapValue(
        exp.attributeTypes,
        (attributeType) => evaluate(mod, env, attributeType),
      )
      return M.createInterfaceType(attributeTypes)
    }

    case "ExtendInterface": {
      const baseType = evaluate(mod, env, exp.baseType)
      const attributeTypes = recordMapValue(
        exp.attributeTypes,
        (attributeType) => evaluate(mod, env, attributeType),
      )
      return M.createExtendInterfaceType(baseType, attributeTypes)
    }

    case "Extend": {
      const base = evaluate(mod, env, exp.base)
      if (!M.isRecordValue(base)) {
        let message = `[evaluate] can only (extend) record base value`
        message += `\n  base value kind: ${base.kind}`
        message += `\n  base value: ${M.formatValue(base)}`
        if (exp.location)
          throw new S.ErrorWithSourceLocation(message, exp.location)
        else throw new Error(message)
      }

      const attributes = recordMapValue(exp.attributes, (attribute) =>
        evaluate(mod, env, attribute),
      )
      return M.RecordValue({ ...base.attributes, ...attributes })
    }

    case "Update": {
      const base = evaluate(mod, env, exp.base)
      if (!M.isRecordValue(base)) {
        let message = `[evaluate] can only (update) record base value`
        message += `\n  base value kind: ${base.kind}`
        message += `\n  base value: ${M.formatValue(base)}`
        if (exp.location)
          throw new S.ErrorWithSourceLocation(message, exp.location)
        else throw new Error(message)
      }

      const attributes = recordMapValue(exp.attributes, (attribute) =>
        evaluate(mod, env, attribute),
      )

      for (const key of Object.keys(attributes)) {
        if (base.attributes[key] === undefined) {
          let message = `[evaluate] missing key in base record`
          message += `\n  key: ${key}`
          if (exp.location)
            throw new S.ErrorWithSourceLocation(message, exp.location)
          else throw new Error(message)
        }
      }

      return M.RecordValue({ ...base.attributes, ...attributes })
    }

    case "UpdateMut": {
      const base = evaluate(mod, env, exp.base)
      if (!M.isRecordValue(base)) {
        let message = `[evaluate] can only (update!) record base value`
        message += `\n  base value kind: ${base.kind}`
        message += `\n  base value: ${M.formatValue(base)}`
        if (exp.location)
          throw new S.ErrorWithSourceLocation(message, exp.location)
        else throw new Error(message)
      }

      const attributes = recordMapValue(exp.attributes, (attribute) =>
        evaluate(mod, env, attribute),
      )

      for (const key of Object.keys(attributes)) {
        if (base.attributes[key] === undefined) {
          let message = `[evaluate] missing key in base record`
          message += `\n  key: ${key}`
          if (exp.location)
            throw new S.ErrorWithSourceLocation(message, exp.location)
          else throw new Error(message)
        } else {
          base.attributes[key] = attributes[key]
        }
      }

      return base
    }

    case "The": {
      return evaluate(mod, env, exp.exp)
    }

    default: {
      let message = `[evaluate] unhandled exp`
      message += `\n  exp kind: ${exp.kind}`
      message += `\n  exp: ${M.formatExp(exp)}`
      if (exp.location)
        throw new S.ErrorWithSourceLocation(message, exp.location)
      else throw new Error(message)
    }
  }
}
