import { envUpdate } from "../env/index.ts"
import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { evaluate, resultValue } from "./evaluate.ts"

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
