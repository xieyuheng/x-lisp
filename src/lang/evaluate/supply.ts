import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"

export function supply(curried: Values.Curried, args: Array<Value>): Value {
  const totalArgs = [...curried.args, ...args]

  if (totalArgs.length < curried.arity) {
    return Values.Curried(curried.target, curried.arity, totalArgs)
  }

  if (totalArgs.length > curried.arity) {
    let message = `[supply] Too many arguments\n`
    message += `  curried: ${formatValue(curried)}\n`
    message += `  args: [${args.map(formatValue).join(" ")}]\n`
    throw new Error(message)
  }

  return apply(curried.target, totalArgs)
}
