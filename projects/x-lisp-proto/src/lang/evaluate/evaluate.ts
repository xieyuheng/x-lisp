import * as S from "@xieyuheng/x-sexp.js"
import { globals } from "../../globals.ts"
import { arrayPickLast } from "../../helpers/array/arrayPickLast.ts"
import { formatUnderTag } from "../../helpers/format/formatUnderTag.ts"
import { recordMapValue } from "../../helpers/record/recordMapValue.ts"
import { emptyEnv, envLookupValue, envUpdate, type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { modLookupValue, type Mod } from "../mod/index.ts"
import { match, patternize } from "../pattern/index.ts"
import { prettyExp, prettyValue, prettyValues } from "../pretty/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"
import { applyPolymorphic } from "./applyPolymorphic.ts"
import { assertEqual } from "./assertEqual.ts"
import { assertNotEqual } from "./assertNotEqual.ts"
import { assertNotTrue } from "./assertNotTrue.ts"
import { assertTrue } from "./assertTrue.ts"
import { evaluateQuasiquote } from "./evaluateQuasiquote.ts"
import { validate } from "./validate.ts"

type Result = [Env, Value]
export type Effect = (mod: Mod, env: Env) => Result

export function resultValue(result: Result): Value {
  const [_, value] = result
  return value
}

export function evaluate(exp: Exp): Effect {
  const maxWidth = globals.maxWidth

  if (Values.isAtom(exp)) {
    return (mod, env) => {
      return [env, exp]
    }
  }

  switch (exp.kind) {
    case "Var": {
      return (mod, env) => {
        const value = envLookupValue(env, exp.name)
        if (value) return [env, value]

        const topValue = modLookupValue(mod, exp.name)
        if (topValue) return [env, topValue]

        let message = `[evaluate] undefined`
        message += `\n  name: ${exp.name}`
        throw new S.ErrorWithMeta(message, exp.meta)
      }
    }

    case "Lambda": {
      return (mod, env) => {
        return [
          env,
          Values.Closure(mod, env, exp.parameters, exp.body, exp.meta),
        ]
      }
    }

    case "VariadicLambda": {
      return (mod, env) => {
        return [
          env,
          Values.VariadicClosure(
            mod,
            env,
            exp.variadicParameter,
            exp.body,
            exp.meta,
          ),
        ]
      }
    }

    case "NullaryLambda": {
      return (mod, env) => {
        return [env, Values.NullaryClosure(mod, env, exp.body, exp.meta)]
      }
    }

    case "Apply": {
      return (mod, env) => {
        const target = resultValue(evaluate(exp.target)(mod, env))
        const args = exp.args.map((arg) => resultValue(evaluate(arg)(mod, env)))
        return [env, apply(target, args)]
      }
    }

    case "BeginSugar": {
      return (mod, env) => {
        const [prefix, last] = arrayPickLast(exp.sequence)
        for (const e of prefix) {
          const [nextEnv, value] = evaluate(e)(mod, env)
          env = nextEnv
        }

        return evaluate(last)(mod, env)
      }
    }

    case "Assign": {
      return (mod, env) => {
        const pattern = patternize(exp.lhs)(mod, env)
        const value = resultValue(evaluate(exp.rhs)(mod, env))
        const resultEnv = match(pattern, value)(emptyEnv())
        if (resultEnv === undefined) {
          let message = `[evaluate] assignment pattern mismatch`
          message += formatUnderTag(2, `lhs exp:`, prettyExp(maxWidth, exp.lhs))
          message += formatUnderTag(2, `rhs exp:`, prettyExp(maxWidth, exp.rhs))
          message += formatUnderTag(
            2,
            `rhs value:`,
            prettyValue(maxWidth, value),
          )
          throw new S.ErrorWithMeta(message, exp.meta)
        }

        return [envUpdate(env, resultEnv), Values.Void()]
      }
    }

    case "Assert": {
      return assertTrue(exp.exp)
    }

    case "AssertNot": {
      return assertNotTrue(exp.exp)
    }

    case "AssertEqual": {
      return assertEqual(exp.lhs, exp.rhs)
    }

    case "AssertNotEqual": {
      return assertNotEqual(exp.lhs, exp.rhs)
    }

    case "AssertThe": {
      return (mod, env) => {
        const schema = resultValue(evaluate(exp.schema)(mod, env))
        const value = resultValue(evaluate(exp.exp)(mod, env))
        const result = validate(schema, value)
        if (result.kind === "Ok") {
          return [env, Values.Void()]
        } else {
          let message = `(assert-the) validation fail`
          message += formatUnderTag(2, `schema:`, prettyValue(maxWidth, schema))
          message += formatUnderTag(2, `value:`, prettyValue(maxWidth, value))
          throw new S.ErrorWithMeta(message, exp.meta)
        }
      }
    }

    case "Tael": {
      return (mod, env) => {
        const value = Values.Tael(
          exp.elements.map((e) => resultValue(evaluate(e)(mod, env))),
          recordMapValue(exp.attributes, (e) =>
            resultValue(evaluate(e)(mod, env)),
          ),
        )
        return [env, value]
      }
    }

    case "Set": {
      return (mod, env) => {
        const set = Values.Set([])
        for (const element of exp.elements) {
          const elementValue = resultValue(evaluate(element)(mod, env))
          if (Values.isHashable(elementValue)) {
            Values.setAdd(set, elementValue)
          } else {
            let message = `[evaluate] element in (@set) is not hashable`
            message += formatUnderTag(
              2,
              `element:`,
              prettyValue(maxWidth, elementValue),
            )
            throw new S.ErrorWithMeta(message, element.meta)
          }
        }

        return [env, set]
      }
    }

    case "Hash": {
      return (mod, env) => {
        const hash = Values.Hash()
        for (const entry of exp.entries) {
          const k = resultValue(evaluate(entry.key)(mod, env))
          const v = resultValue(evaluate(entry.value)(mod, env))
          if (!Values.isHashable(k)) {
            let message = `[evaluate] Key in (@hash) is not hashable`
            message += formatUnderTag(2, `key:`, prettyValue(maxWidth, k))
            message += formatUnderTag(2, `value:`, prettyValue(maxWidth, v))
            throw new S.ErrorWithMeta(message, entry.key.meta)
          }

          Values.hashPut(hash, k, v)
        }

        return [env, hash]
      }
    }

    case "Quote": {
      return (mod, env) => {
        return [env, exp.sexp]
      }
    }

    case "Comment": {
      return (mod, env) => {
        return [env, Values.Void()]
      }
    }

    case "Quasiquote": {
      return evaluateQuasiquote(exp.sexp)
    }

    case "If": {
      return (mod, env) => {
        const condition = resultValue(evaluate(exp.condition)(mod, env))
        if (!Values.isBool(condition)) {
          let message = `(if) the condition must be bool`
          message += formatUnderTag(
            2,
            `condition:`,
            prettyValue(maxWidth, condition),
          )
          throw new S.ErrorWithMeta(message, exp.meta)
        }

        if (Values.isTrue(condition)) {
          return evaluate(exp.consequent)(mod, env)
        } else {
          return evaluate(exp.alternative)(mod, env)
        }
      }
    }

    case "When": {
      return (mod, env) => {
        const condition = resultValue(evaluate(exp.condition)(mod, env))
        if (!Values.isBool(condition)) {
          let message = `(when) the condition must be bool`
          message += formatUnderTag(
            2,
            `condition:`,
            prettyValue(maxWidth, condition),
          )
          throw new S.ErrorWithMeta(message, exp.meta)
        }

        if (Values.isTrue(condition)) {
          return evaluate(exp.consequent)(mod, env)
        } else {
          return [env, Values.Void()]
        }
      }
    }

    case "Unless": {
      return (mod, env) => {
        const condition = resultValue(evaluate(exp.condition)(mod, env))
        if (!Values.isBool(condition)) {
          let message = `(unless) the condition must be bool`
          message += formatUnderTag(
            2,
            `condition:`,
            prettyValue(maxWidth, condition),
          )
          throw new S.ErrorWithMeta(message, exp.meta)
        }

        if (Values.isFalse(condition)) {
          return evaluate(exp.consequent)(mod, env)
        } else {
          return [env, Values.Void()]
        }
      }
    }

    case "And": {
      return (mod, env) => {
        for (const e of exp.exps) {
          const value = resultValue(evaluate(e)(mod, env))
          if (!Values.isBool(value)) {
            let message = `[evaluate] The subexpressions of (and) must evaluate to bool`
            message += formatUnderTag(2, `value:`, prettyValue(maxWidth, value))
            throw new S.ErrorWithMeta(message, exp.meta)
          }

          if (Values.isFalse(value)) {
            return [env, Values.Bool(false)]
          }
        }

        return [env, Values.Bool(true)]
      }
    }

    case "Or": {
      return (mod, env) => {
        for (const e of exp.exps) {
          const value = resultValue(evaluate(e)(mod, env))
          if (!Values.isBool(value)) {
            let message = `[evaluate] The subexpressions of (or) must evaluate to bool`
            message += formatUnderTag(2, `value:`, prettyValue(maxWidth, value))
            throw new S.ErrorWithMeta(message, exp.meta)
          }

          if (Values.isTrue(value)) {
            return [env, Values.Bool(true)]
          }
        }

        return [env, Values.Bool(false)]
      }
    }

    case "Cond": {
      return (mod, env) => {
        for (const condLine of exp.condLines) {
          const value = resultValue(evaluate(condLine.question)(mod, env))
          if (!Values.isBool(value)) {
            let message = `[evaluate] The question part of a (cond) line must evaluate to bool`
            message += formatUnderTag(2, `value:`, prettyValue(maxWidth, value))
            throw new S.ErrorWithMeta(message, exp.meta)
          }

          if (Values.isTrue(value)) {
            return evaluate(condLine.answer)(mod, env)
          }
        }

        let message = `[evaluate] All questions of a (cond) failed`
        throw new S.ErrorWithMeta(message, exp.meta)
      }
    }

    case "Match": {
      return (mod, env) => {
        const target = resultValue(evaluate(exp.target)(mod, env))
        for (const matchLine of exp.matchLines) {
          const pattern = patternize(matchLine.pattern)(mod, env)
          const resultEnv = match(pattern, target)(emptyEnv())
          if (resultEnv) {
            return evaluate(matchLine.body)(mod, envUpdate(env, resultEnv))
          }
        }

        let message = `[evaluate] (match) mismatch`
        message += formatUnderTag(2, `target:`, prettyValue(maxWidth, target))
        throw new S.ErrorWithMeta(message, exp.meta)
      }
    }

    case "Arrow": {
      return (mod, env) => {
        const argSchemas = exp.argSchemas.map((e) =>
          resultValue(evaluate(e)(mod, env)),
        )
        const retSchema = resultValue(evaluate(exp.retSchema)(mod, env))
        return [env, Values.Arrow(argSchemas, retSchema)]
      }
    }

    case "VariadicArrow": {
      return (mod, env) => {
        const argSchema = resultValue(evaluate(exp.argSchema)(mod, env))
        const retSchema = resultValue(evaluate(exp.retSchema)(mod, env))
        return [env, Values.VariadicArrow(argSchema, retSchema)]
      }
    }

    case "Tau": {
      return (mod, env) => {
        const value = Values.Tau(
          exp.elementSchemas.map((e) => resultValue(evaluate(e)(mod, env))),
          recordMapValue(exp.attributeSchemas, (e) =>
            resultValue(evaluate(e)(mod, env)),
          ),
        )
        return [env, value]
      }
    }

    case "The": {
      return (mod, env) => {
        const schema = resultValue(evaluate(exp.schema)(mod, env))
        const value = resultValue(evaluate(exp.exp)(mod, env))
        const result = validate(schema, value)
        if (result.kind === "Ok") {
          return [env, result.value]
        } else {
          let message = `(the) validation fail`
          message += formatUnderTag(2, `schema:`, prettyValue(maxWidth, schema))
          message += formatUnderTag(2, `value:`, prettyValue(maxWidth, value))
          throw new S.ErrorWithMeta(message, exp.meta)
        }
      }
    }

    case "Pattern": {
      return (mod, env) => {
        const pattern = patternize(exp.pattern)(mod, env)
        return [env, Values.Pattern(pattern)]
      }
    }

    case "Polymorphic": {
      return (mod, env) => {
        return [env, Values.Polymorphic(mod, env, exp.parameters, exp.schema)]
      }
    }

    case "Specific": {
      return (mod, env) => {
        const target = resultValue(evaluate(exp.target)(mod, env))
        const args = exp.args.map((arg) => resultValue(evaluate(arg)(mod, env)))

        if (target.kind !== "The") {
          let message = `[evaluate] specific application expect target to be contracted -- (the) value`
          message += formatUnderTag(2, `target:`, prettyValue(maxWidth, target))
          message += formatUnderTag(2, `args:`, prettyValues(maxWidth, args))
          throw new S.ErrorWithMeta(message, exp.meta)
        }

        if (target.schema.kind !== "Polymorphic") {
          let message = `[evaluate] specific application expect the schema of the target to be polymorphic`
          message += formatUnderTag(
            2,
            `target schema:`,
            prettyValue(maxWidth, target.schema),
          )
          message += formatUnderTag(2, `target:`, prettyValue(maxWidth, target))
          message += formatUnderTag(2, `args:`, prettyValues(maxWidth, args))
          throw new S.ErrorWithMeta(message, exp.meta)
        }

        return [
          env,
          Values.The(applyPolymorphic(target.schema, args), target.value),
        ]
      }
    }
  }
}
