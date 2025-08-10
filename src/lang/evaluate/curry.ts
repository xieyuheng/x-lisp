import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"

export function curry(target: Value, arity: number, args: Array<Value>): Value {
  if (args.length < arity) {
    return Values.Curried(target, arity, args)
  }

  if (args.length > arity) {
    let message = `[curry] Too many arguments\n`
    message += `  target: ${formatValue(target)}\n`
    message += `  arity: ${arity}\n`
    message += `  args: [${args.map(formatValue).join(" ")}]\n`
    throw new Error(message)
  }

  return apply(target, args)
}
