import assert from "node:assert"
import { formatValue } from "../format/index.ts"
import { modLookupDefinition } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { call } from "./call.ts"
import { type Context } from "./Context.ts"

export function apply(context: Context, target: Value, arg: Value): Value {
  switch (target.kind) {
    case "Curry": {
      if (target.arity > 1) {
        const newArity = target.arity - 1
        const newArgs = [...target.args, arg]
        return Values.Curry(target.target, newArity, newArgs)
      } else {
        assert(target.arity === 1)
        const newArgs = [...target.args, arg]
        const fn = Values.asFunction(target.target)
        const definition = modLookupDefinition(context.mod, fn.name)
        assert(definition)
        return call(context, definition, newArgs)
      }
    }

    case "Function": {
      if (target.arity > 1) {
        const newArity = target.arity - 1
        return Values.Curry(target, newArity, [arg])
      } else {
        assert(target.arity === 1)
        const fn = target
        const definition = modLookupDefinition(context.mod, fn.name)
        assert(definition)
        return call(context, definition, [arg])
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
