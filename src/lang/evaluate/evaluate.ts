import * as X from "@xieyuheng/x-data.js"
import assert from "node:assert"
import { arrayPickLast } from "../../utils/array/arrayPickLast.ts"
import { recordMap } from "../../utils/record/recordMap.ts"
import { useBuiltinMod } from "../builtin/index.ts"
import { emptyEnv, envLookupValue, envUpdate, type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatExp, formatValue, formatValues } from "../format/index.ts"
import { modLookupValue, type Mod } from "../mod/index.ts"
import { match, patternize } from "../pattern/index.ts"
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
  if (Values.isAtom(exp)) {
    return (mod, env) => {
      return [env, exp]
    }
  }

  switch (exp.kind) {
    case "Var": {
      return (mod, env) => {
        const value = envLookupValue(env, exp.name)
        if (value) return [env, Values.lazyWalk(value)]

        const topValue = modLookupValue(mod, exp.name)
        if (topValue) return [env, Values.lazyWalk(topValue)]

        let message = `[evaluate] I meet undefined name: ${exp.name}\n`
        throw new X.ErrorWithMeta(message, exp.meta)
      }
    }

    case "Lambda": {
      return (mod, env) => {
        return [
          env,
          Values.Lambda(mod, env, exp.parameters, exp.body, exp.meta),
        ]
      }
    }

    case "LambdaLazy": {
      return (mod, env) => {
        return [
          env,
          Values.LambdaLazy(mod, env, exp.parameters, exp.body, exp.meta),
        ]
      }
    }

    case "Thunk": {
      return (mod, env) => {
        return [env, Values.Thunk(mod, env, exp.body, exp.meta)]
      }
    }

    case "Lazy": {
      return (mod, env) => {
        return [env, Values.Lazy(mod, env, exp.exp)]
      }
    }

    case "Apply": {
      return (mod, env) => {
        const target = Values.lazyWalk(
          resultValue(evaluate(exp.target)(mod, env)),
        )
        if (target.kind === "LambdaLazy") {
          const args = exp.args.map((arg) => Values.Lazy(mod, env, arg))
          return [env, apply(target, args)]
        } else {
          const args = exp.args.map((arg) =>
            resultValue(evaluate(arg)(mod, env)),
          )
          return [env, apply(target, args)]
        }
      }
    }

    case "Begin": {
      return (mod, env) => {
        const [prefix, last] = arrayPickLast(exp.sequence)
        for (const e of prefix) {
          const [nextEnv, value] = evaluate(e)(mod, env)
          // There might be side-effect in lazy value!
          Values.lazyWalk(value)
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
          let message = `[evaluate] assignment pattern mismatch\n`
          message += `  lhs exp: ${formatExp(exp.lhs)}\n`
          message += `  rhs exp: ${formatExp(exp.rhs)}\n`
          message += `  rhs value: ${formatValue(value)}\n`
          throw new X.ErrorWithMeta(message, exp.meta)
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
          let message = `(assert-the) validation fail\n`
          message += `  schema: ${formatValue(schema)}\n`
          message += `  value: ${formatValue(value)}\n`
          throw new X.ErrorWithMeta(message, exp.meta)
        }
      }
    }

    case "Tael": {
      return (mod, env) => {
        const value = Values.Tael(
          exp.elements.map((e) => resultValue(evaluate(e)(mod, env))),
          recordMap(exp.attributes, (e) => resultValue(evaluate(e)(mod, env))),
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
            let message = `[evaluate] element in (@set) is not hashable\n`
            message += `  element: ${formatValue(elementValue)}\n`
            throw new X.ErrorWithMeta(message, element.meta)
          }
        }

        return [env, set]
      }
    }

    case "Hash": {
      return (mod, env) => {
        const hash = Values.Hash()
        for (const entry of exp.entries) {
          const k = Values.lazyWalk(resultValue(evaluate(entry.key)(mod, env)))
          const v = Values.lazyWalk(
            resultValue(evaluate(entry.value)(mod, env)),
          )
          if (!Values.isHashable(k)) {
            let message = `[evaluate] Key in (@hash) is not hashable\n`
            message += `  key: ${formatValue(k)}\n`
            message += `  value: ${formatValue(v)}\n`
            throw new X.ErrorWithMeta(message, entry.key.meta)
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

    case "Quasiquote": {
      return evaluateQuasiquote(exp.sexp)
    }

    case "If": {
      return (mod, env) => {
        const condition = Values.lazyWalk(
          resultValue(evaluate(exp.condition)(mod, env)),
        )
        if (!Values.isBool(condition)) {
          let message = `[evaluate] The condition part of a (if) must be bool\n`
          message += `  condition: ${formatValue(condition)}\n`
          throw new X.ErrorWithMeta(message, exp.meta)
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
        const condition = Values.lazyWalk(
          resultValue(evaluate(exp.condition)(mod, env)),
        )
        if (!Values.isBool(condition)) {
          let message = `[evaluate] The condition part of a (when) must be bool\n`
          message += `  condition: ${formatValue(condition)}\n`
          throw new X.ErrorWithMeta(message, exp.meta)
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
        const condition = Values.lazyWalk(
          resultValue(evaluate(exp.condition)(mod, env)),
        )
        if (!Values.isBool(condition)) {
          let message = `[evaluate] The condition part of a (unless) must be bool\n`
          message += `  condition: ${formatValue(condition)}\n`
          throw new X.ErrorWithMeta(message, exp.meta)
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
          const value = Values.lazyWalk(resultValue(evaluate(e)(mod, env)))
          if (!Values.isBool(value)) {
            let message = `[evaluate] The subexpressions of (and) must evaluate to bool\n`
            message += `  value: ${formatValue(value)}\n`
            throw new X.ErrorWithMeta(message, exp.meta)
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
          const value = Values.lazyWalk(resultValue(evaluate(e)(mod, env)))
          if (!Values.isBool(value)) {
            let message = `[evaluate] The subexpressions of (or) must evaluate to bool\n`
            message += `  value: ${formatValue(value)}\n`
            throw new X.ErrorWithMeta(message, exp.meta)
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
          const value = Values.lazyWalk(
            resultValue(evaluate(condLine.question)(mod, env)),
          )
          if (!Values.isBool(value)) {
            let message = `[evaluate] The question part of a (cond) line must evaluate to bool\n`
            message += `  value: ${formatValue(value)}\n`
            throw new X.ErrorWithMeta(message, exp.meta)
          }

          if (Values.isTrue(value)) {
            return evaluate(condLine.answer)(mod, env)
          }
        }

        let message = `[evaluate] All questions of a (cond) failed\n`
        throw new X.ErrorWithMeta(message, exp.meta)
      }
    }

    case "Match": {
      return (mod, env) => {
        const target = Values.lazyWalk(
          resultValue(evaluate(exp.target)(mod, env)),
        )
        for (const matchLine of exp.matchLines) {
          const pattern = patternize(matchLine.pattern)(mod, env)
          const resultEnv = match(pattern, target)(emptyEnv())
          if (resultEnv) {
            return evaluate(matchLine.body)(mod, envUpdate(env, resultEnv))
          }
        }

        let message = `[evaluate] (match) mismatch\n`
        message += `  target: ${formatValue(target)}\n`
        throw new X.ErrorWithMeta(message, exp.meta)
      }
    }

    case "Union": {
      return (mod, env) => {
        const preludeMod = useBuiltinMod()
        const value = modLookupValue(preludeMod, "union-fn")
        assert(value)
        const predicates = exp.exps.map((e) =>
          resultValue(evaluate(e)(mod, env)),
        )
        return [env, apply(value, [Values.List(predicates)])]
      }
    }

    case "Inter": {
      return (mod, env) => {
        const preludeMod = useBuiltinMod()
        const value = modLookupValue(preludeMod, "inter-fn")
        assert(value)
        const predicates = exp.exps.map((e) =>
          resultValue(evaluate(e)(mod, env)),
        )
        return [env, apply(value, [Values.List(predicates)])]
      }
    }

    case "Arrow": {
      return (mod, env) => {
        const args = exp.args.map((e) => resultValue(evaluate(e)(mod, env)))
        const ret = resultValue(evaluate(exp.ret)(mod, env))
        return [env, Values.Arrow(args, ret)]
      }
    }

    case "Compose": {
      return (mod, env) => {
        const preludeMod = useBuiltinMod()
        const value = modLookupValue(preludeMod, "compose-fn")
        assert(value)
        const fs = exp.exps.map((e) => resultValue(evaluate(e)(mod, env)))
        return [env, apply(value, [Values.List(fs)])]
      }
    }

    case "Pipe": {
      return (mod, env) => {
        const preludeMod = useBuiltinMod()
        const value = modLookupValue(preludeMod, "pipe-fn")
        assert(value)
        const fs = exp.exps.map((e) => resultValue(evaluate(e)(mod, env)))
        return [
          env,
          apply(value, [
            resultValue(evaluate(exp.arg)(mod, env)),
            Values.List(fs),
          ]),
        ]
      }
    }

    case "Tau": {
      return (mod, env) => {
        const value = Values.Tau(
          exp.elementSchemas.map((e) => resultValue(evaluate(e)(mod, env))),
          recordMap(exp.attributeSchemas, (e) =>
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
          let message = `(the) validation fail\n`
          message += `  schema: ${formatValue(schema)}\n`
          message += `  value: ${formatValue(value)}\n`
          throw new X.ErrorWithMeta(message, exp.meta)
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
        const target = Values.lazyWalk(
          resultValue(evaluate(exp.target)(mod, env)),
        )
        const args = exp.args.map((arg) => resultValue(evaluate(arg)(mod, env)))

        if (target.kind !== "The") {
          let message = `[evaluate] specific application expect target to be contracted -- (the) value\n`
          message += `  target: ${formatValue(target)}\n`
          message += `  args: ${formatValues(args)}\n`
          throw new X.ErrorWithMeta(message, exp.meta)
        }

        if (target.schema.kind !== "Polymorphic") {
          let message = `[evaluate] specific application expect the schema of the target to be polymorphic\n`
          message += `  target schema: ${formatValue(target.schema)}\n`
          message += `  target: ${formatValue(target)}\n`
          message += `  args: ${formatValues(args)}\n`
          throw new X.ErrorWithMeta(message, exp.meta)
        }

        return [
          env,
          Values.The(applyPolymorphic(target.schema, args), target.value),
        ]
      }
    }
  }
}
