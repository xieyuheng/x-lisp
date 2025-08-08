import * as X from "@xieyuheng/x-data.js"
import { arrayPickLast } from "../../utils/array/arrayPickLast.ts"
import { recordMap } from "../../utils/record/recordMap.ts"
import { urlPathRelativeToCwd } from "../../utils/url/urlPathRelativeToCwd.ts"
import { envFindValue, envUpdate, type Env } from "../env/index.ts"
import { bindsToArray, type Exp } from "../exp/index.ts"
import { formatExp, formatValue } from "../format/index.ts"
import { modGetValue, modReportSource, type Mod } from "../mod/index.ts"
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
        let value = undefined

        value = envFindValue(env, exp.name)
        if (value !== undefined) return [env, value]

        value = modGetValue(mod, exp.name)
        if (value !== undefined) return [env, value]

        throw new Error(
          `[evaluate] I meet undefined name: ${exp.name}\n` +
            `[source] ${urlPathRelativeToCwd(mod.url)}\n`,
        )
      }
    }

    case "Lambda": {
      return (mod, env) => [env, Values.Lambda(mod, env, exp.name, exp.body)]
    }

    case "Apply": {
      return (mod, env) => {
        const target = resultValue(evaluate(exp.target)(mod, env))
        const args = exp.args.map((arg) => resultValue(evaluate(arg)(mod, env)))
        return [env, apply(target, args)]
      }
    }

    case "Let": {
      return (mod, env) => {
        const oldEnv = env
        for (const bind of bindsToArray(exp.binds)) {
          const value = resultValue(evaluate(bind.exp)(mod, oldEnv))
          env = envUpdate(env, bind.name, value)
        }

        return evaluate(exp.body)(mod, env)
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
        return [envUpdate(env, exp.name, value), Values.Void()]
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
          if (mod.text) message += X.spanReport(exp.meta.span, mod.text)
          console.log(message)
        }

        if (value.kind === "Bool" && value.content === false) {
          let message = `[assert] fail\n` + `  exp: ${formatExp(exp.exp)}\n`
          message += `[source] ${modReportSource(mod, exp.meta.span)}\n`
          if (mod.text) message += X.spanReport(exp.meta.span, mod.text)
          console.log(message)
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
              `[source] ${urlPathRelativeToCwd(mod.url)}\n`,
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
                `[source] ${urlPathRelativeToCwd(mod.url)}\n`,
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
                `[source] ${urlPathRelativeToCwd(mod.url)}\n`,
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
                `[source] ${urlPathRelativeToCwd(mod.url)}\n`,
            )
          }

          if (value.content === true) {
            return evaluate(condLine.answer)(mod, env)
          }
        }

        throw new Error(
          `[evaluate] All questions of a (cond) failed\n` +
            `[source] ${urlPathRelativeToCwd(mod.url)}\n`,
        )
      }
    }

    case "Union": {
      return (mod, env) => {
        throw new Error("TODO")
      }
    }

    case "Inter": {
      return (mod, env) => {
        throw new Error("TODO")
      }
    }
  }
}
