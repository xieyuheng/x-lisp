import { arrayPickLast } from "../../utils/array/arrayPickLast.ts"
import { recordMap } from "../../utils/record/recordMap.ts"
import { urlPathRelativeToCwd } from "../../utils/url/urlPathRelativeToCwd.ts"
import { envFindValue, envUpdate, type Env } from "../env/index.ts"
import { bindsToArray, type Exp } from "../exp/index.ts"
import { formatValue } from "../format/index.ts"
import { modGetValue, type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { isAtom, type Value } from "../value/index.ts"

export type Result = [Env, Value]
export type Effect = (mod: Mod, env: Env) => Result

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
        const arg = resultValue(evaluate(exp.arg)(mod, env))
        return [env, apply(target, arg)]
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
        const [prefix, last] = arrayPickLast(exp.body)
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
        return [envUpdate(env, exp.name, value), value]
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
  }
}

export function apply(target: Value, arg: Value): Value {
  if (target.kind === "Lazy") {
    return apply(Values.lazyActive(target), arg)
  }

  if (target.kind === "Lambda") {
    return resultValue(
      evaluate(target.ret)(target.mod, envUpdate(target.env, target.name, arg)),
    )
  }

  if (target.kind === "PrimFn") {
    if (target.arity === 1) {
      return target.fn(arg)
    } else {
      return Values.CurriedPrimFn(target, [arg])
    }
  }

  if (target.kind === "CurriedPrimFn") {
    if (target.args.length + 1 === target.primFn.arity) {
      return target.primFn.fn(...target.args, arg)
    } else {
      return Values.CurriedPrimFn(target.primFn, [...target.args, arg])
    }
  }

  throw new Error(
    `[apply] I can not handle this kind of target\n` +
      `  target: ${formatValue(target)}\n` +
      `  arg: ${formatValue(arg)}\n`,
  )
}
