import * as X from "@xieyuheng/x-data.js"
import assert from "node:assert"
import process from "node:process"
import { arrayPickLast } from "../../utils/array/arrayPickLast.ts"
import { recordMap } from "../../utils/record/recordMap.ts"
import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import { emptyEnv, envGet, envSet, envUpdate, type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatExp, formatValue } from "../format/index.ts"
import { modGetValue, modReportSource, type Mod } from "../mod/index.ts"
import { match, patternize } from "../pattern/index.ts"
import { usePreludeMod } from "../prelude/index.ts"
import * as Values from "../value/index.ts"
import { isAtom, type Value } from "../value/index.ts"
import { apply } from "./apply.ts"

type Result = [Env, Value]
type Effect = (mod: Mod, env: Env) => Result

export function resultValue(result: Result): Value {
  const [_, value] = result
  return value
}

export function evaluate(exp: Exp): Effect {
  if (isAtom(exp)) {
    return (mod, env) => [env, exp]
  }

  switch (exp.kind) {
    case "Var": {
      return (mod, env) => {
        const value = envGet(env, exp.name)
        if (value) return [env, value]

        const topValue = modGetValue(mod, exp.name)
        if (topValue) return [env, topValue]

        let message = `[evaluate] I meet undefined name: ${exp.name}\n`
        message += `[source] ${urlRelativeToCwd(mod.url)}\n`
        throw new Error(message)
      }
    }

    case "Lambda": {
      return (mod, env) => [
        env,
        Values.Lambda(mod, env, exp.parameters, exp.body),
      ]
    }

    case "Apply": {
      return (mod, env) => {
        const target = resultValue(evaluate(exp.target)(mod, env))
        const args = exp.args.map((arg) => resultValue(evaluate(arg)(mod, env)))
        return [env, apply(target, args)]
      }
    }

    case "Begin": {
      return (mod, env) => {
        const [prefix, last] = arrayPickLast(exp.sequence)
        for (const e of prefix) {
          const [nextEnv, _] = evaluate(e)(mod, env)
          env = nextEnv
        }

        return evaluate(last)(mod, env)
      }
    }

    case "Assign": {
      return (mod, env) => {
        const value = resultValue(evaluate(exp.rhs)(mod, env))
        return [envSet(env, exp.name, value), Values.Void()]
      }
    }

    case "Assert": {
      return (mod, env) => {
        const value = resultValue(evaluate(exp.exp)(mod, env))

        if (value.kind !== "Bool") {
          let message =
            `[assert] fail on non boolean value\n` +
            `  value: ${formatValue(value)}\n` +
            `  exp: ${formatExp(exp.exp)}\n`
          message += `[source] ${modReportSource(mod, exp.meta.span)}\n`
          if (mod.code) message += X.spanReport(exp.meta.span, mod.code)
          console.log(message)
          process.exit(1)
        }

        if (value.kind === "Bool" && value.content === false) {
          let message = `[assert] fail\n` + `  exp: ${formatExp(exp.exp)}\n`
          message += `[source] ${modReportSource(mod, exp.meta.span)}\n`
          if (mod.code) message += X.spanReport(exp.meta.span, mod.code)
          console.log(message)
          process.exit(1)
        }

        return [env, Values.Void()]
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

    case "Quote": {
      return (mod, env) => [env, exp.data]
    }

    case "If": {
      return (mod, env) => {
        const condition = resultValue(evaluate(exp.condition)(mod, env))
        if (condition.kind !== "Bool") {
          throw new Error(
            `[evaluate] The condition part of a (if) must be bool\n` +
              `  condition: ${formatValue(condition)}\n` +
              `[source] ${urlRelativeToCwd(mod.url)}\n`,
          )
        }

        if (condition.content) {
          return evaluate(exp.consequent)(mod, env)
        } else {
          return evaluate(exp.alternative)(mod, env)
        }
      }
    }

    case "And": {
      return (mod, env) => {
        for (const e of exp.exps) {
          const value = resultValue(evaluate(e)(mod, env))
          if (value.kind !== "Bool") {
            throw new Error(
              `[evaluate] The subexpressions of (and) must evaluate to bool\n` +
                `  value: ${formatValue(value)}\n` +
                `[source] ${urlRelativeToCwd(mod.url)}\n`,
            )
          }

          if (value.content === false) {
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
          if (value.kind !== "Bool") {
            throw new Error(
              `[evaluate] The subexpressions of (or) must evaluate to bool\n` +
                `  value: ${formatValue(value)}\n` +
                `[source] ${urlRelativeToCwd(mod.url)}\n`,
            )
          }

          if (value.content === true) {
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
          if (value.kind !== "Bool") {
            throw new Error(
              `[evaluate] The question part of a (cond) line must evaluate to bool\n` +
                `  value: ${formatValue(value)}\n` +
                `[source] ${urlRelativeToCwd(mod.url)}\n`,
            )
          }

          if (value.content === true) {
            return evaluate(condLine.answer)(mod, env)
          }
        }

        throw new Error(
          `[evaluate] All questions of a (cond) failed\n` +
            `[source] ${urlRelativeToCwd(mod.url)}\n`,
        )
      }
    }

    case "Match": {
      return (mod, env) => {
        const target = resultValue(evaluate(exp.target)(mod, env))
        for (const matchLine of exp.matchLines) {
          const pattern = patternize(matchLine.pattern)(mod, env)
          const resultEnv = match(target, pattern)(emptyEnv())
          if (resultEnv) {
            return evaluate(matchLine.body)(mod, envUpdate(env, resultEnv))
          }
        }

        let message = `[evaluate] (match) mismatch\n`
        message += `[source] ${urlRelativeToCwd(mod.url)}\n`
        throw new Error(message)
      }
    }

    case "Union": {
      return (mod, env) => {
        const preludeMod = usePreludeMod()
        const value = modGetValue(preludeMod, "union/fn")
        assert(value)
        const predicates = exp.exps.map((e) =>
          resultValue(evaluate(e)(mod, env)),
        )
        return [env, apply(value, [Values.List(predicates)])]
      }
    }

    case "Inter": {
      return (mod, env) => {
        const preludeMod = usePreludeMod()
        const value = modGetValue(preludeMod, "inter/fn")
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
  }
}
