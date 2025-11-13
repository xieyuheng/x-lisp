import assert from "node:assert"
import { formatValue, formatValues } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { call } from "./call.ts"
import { type Context } from "./Context.ts"

export function apply(
  context: Context,
  target: Value,
  arg: Value,
): Value {
  switch (target.kind) {
    case "Curry": {
      if (target.arity > 1) {
        const newArity = target.arity - 1
        const newArgs = [...target.args, arg]
        return Values.Curry(target.target, newArity, newArgs)
      } else {
        assert(target.arity === 1)
        const newArgs = [...target.args, arg]
        return call(context, target.target.name, newArgs)
      }
    }

    case "FunctionRef": {
      if (target.arity > 1) {
        const newArity = target.arity - 1
        return Values.Curry(target, newArity, [arg])
      } else {
        assert(target.arity === 1)
        return call(context, target.name, [arg])
      }
    }

    default: {
      let message = `[apply] can not apply target`
      message += `\n  target: ${formatValue(target)}`
      message += `\n  arg: ${formatValue(arg)}`
      throw new Error(message)
    }
  }
}
