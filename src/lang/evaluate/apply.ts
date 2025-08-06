import { envUpdate } from "../env/index.ts"
import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { evaluate, resultValue } from "./evaluate.ts"

export function apply(target: Value, args: Array<Value>): Value {
  if (target.kind === "Lazy") {
    return apply(Values.lazyActive(target), args)
  }

  if (target.kind === "Lambda") {
    if (args.length === 0) {
      throw new Error(
        `[apply] Can not apply lambda to zero arguments\n` +
          `  target: ${formatValue(target)}\n`,
      )
    }

    const [firstArg, ...restArgs] = args
    const nextEnv = envUpdate(target.env, target.name, firstArg)
    const nextTarget = resultValue(evaluate(target.ret)(target.mod, nextEnv))
    return apply(nextTarget, restArgs)
  }

  if (target.kind === "PrimFn") {
    if (args.length === target.arity) {
      return target.fn(...args)
    } else if (args.length < target.arity) {
      return Values.CurriedPrimFn(target, args)
    } else {
      throw new Error(
        `[apply] Too many arguments\n` +
          `  target: ${formatValue(target)}\n` +
          `  args: [${args.map(formatValue).join(" ")}]\n`,
      )
    }
  }

  if (target.kind === "CurriedPrimFn") {
    if (target.args.length + args.length === target.primFn.arity) {
      return target.primFn.fn(...target.args, ...args)
    } else if (target.args.length + args.length < target.primFn.arity) {
      return Values.CurriedPrimFn(target.primFn, [...target.args, ...args])
    } else {
      throw new Error(
        `[apply] Too many arguments\n` +
          `  target: ${formatValue(target)}\n` +
          `  args: [${args.map(formatValue).join(" ")}]\n`,
      )
    }
  }

  if (target.kind === "DataConstructor") {
    if (target.fields.length !== args.length) {
      throw new Error(
        `[apply] data constructor arity mismatch\n` +
          `  target: ${formatValue(target)}\n` +
          `  args: [${args.map(formatValue).join(" ")}]\n`,
      )
    }

    return Values.Data(target, args)
  }

  throw new Error(
    `[apply] I can not handle this kind of target\n` +
      `  target: ${formatValue(target)}\n` +
      `  args: [${args.map(formatValue).join(" ")}]\n`,
  )
}
