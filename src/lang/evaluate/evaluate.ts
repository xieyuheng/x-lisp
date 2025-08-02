import assert from "node:assert"
import { recordMap } from "../../utils/record/recordMap.ts"
import { envFindValue, envUpdate, type Env } from "../env/index.ts"
import { bindsToArray, type Exp } from "../exp/index.ts"
import { formatValue } from "../format/index.ts"
import { modGetValue, type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { isAtom, type Value } from "../value/index.ts"

export function evaluate(mod: Mod, env: Env, exp: Exp): Value {
  if (isAtom(exp)) {
    return exp
  }

  switch (exp.kind) {
    case "Var": {
      let value = undefined

      value = envFindValue(env, exp.name)
      if (value !== undefined) return value

      value = modGetValue(mod, exp.name)
      if (value !== undefined) return value

      throw new Error(
        `[evaluate] I meet undefined name: ${exp.name}, in mod: ${mod.url}`,
      )
    }

    case "Lambda": {
      return Values.Lambda(mod, env, exp.name, exp.ret)
    }

    case "Apply": {
      const target = evaluate(mod, env, exp.target)
      const arg = evaluate(mod, env, exp.arg)
      return apply(target, arg)
    }

    case "Let": {
      const oldEnv = env
      for (const bind of bindsToArray(exp.binds)) {
        env = envUpdate(env, bind.name, evaluate(mod, oldEnv, bind.exp))
      }

      return evaluate(mod, env, exp.body)
    }

    case "Tael": {
      return Values.Tael(
        exp.elements.map((e) => evaluate(mod, env, e)),
        recordMap(exp.attributes, (e) => evaluate(mod, env, e)),
      )
    }

    case "Quote": {
      return exp.data
    }
  }
}

export function apply(target: Value, arg: Value): Value {
  if (target.kind === "Lazy") {
    return apply(Values.lazyActive(target), arg)
  }

  if (target.kind === "Lambda") {
    return evaluate(
      target.mod,
      envUpdate(target.env, target.name, arg),
      target.ret,
    )
  }

  if (target.kind === "PrimFn") {
    assert(target.arity === 1)
    return target.fn(arg)
  }

  throw new Error(
    `[apply] can not apply\n` +
      `  target: ${formatValue(target)}\n` +
      `  arg: ${formatValue(arg)}\n`,
  )
}
