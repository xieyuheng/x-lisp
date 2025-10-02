import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"

export function supply(
  target: Value,
  arity: number,
  args: Array<Value>,
): Value {
  if (args.length < arity) {
    return Values.Curried(target, arity, args)
  } else if (args.length > arity) {
    return apply(apply(target, args.slice(0, arity)), args.slice(arity))
  } else {
    return apply(target, args)
  }
}
