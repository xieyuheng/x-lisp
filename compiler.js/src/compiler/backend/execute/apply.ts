import { formatValue, formatValues } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { call } from "./call.ts"
import { type Context } from "./Context.ts"

export function apply(
  context: Context,
  target: Value,
  args: Array<Value>,
): Value {
  switch (target.kind) {
    case "Curry": {
      if (args.length < target.arity) {
        const newArity = target.arity - args.length
        const newArgs = [...target.args, ...args]
        return Values.Curry(target.target, newArity, newArgs)
      } else if (args.length === target.arity) {
        const newArgs = [...target.args, ...args]
        return apply(context, target.target, newArgs)
      } else {
        const enoughArgs = args.slice(0, target.arity)
        const spilledArgs = args.slice(target.arity)
        const newTarget = apply(context, target, enoughArgs)
        return apply(context, newTarget, spilledArgs)
      }
    }

    case "FunctionRef": {
      if (args.length < target.arity) {
        return Values.Curry(target, target.arity, args)
      } else if (args.length === target.arity) {
        return call(context, target.name, args)
      } else {
        const enoughArgs = args.slice(0, target.arity)
        const spilledArgs = args.slice(target.arity)
        const newTarget = call(context, target.name, enoughArgs)
        return apply(context, newTarget, spilledArgs)
      }
    }

    default: {
      let message = `[apply] can not apply target`
      message += `\n  target: ${formatValue(target)}`
      message += `\n  args: ${formatValues(args)}`
      throw new Error(message)
    }
  }
}
