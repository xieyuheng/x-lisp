import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import { globals } from "../../globals.ts"
import { envPut } from "../env/index.ts"
import { prettyValue, prettyValues } from "../pretty/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { evaluate, resultValue } from "./evaluate.ts"

const isAny = Values.PrimitiveFunction("any?", 1, () => Values.Bool(true))
export function applyPolymorphicWithAnythings(
  polymorphic: Values.Polymorphic,
): Value {
  return applyPolymorphic(
    polymorphic,
    polymorphic.parameters.map((_) => isAny),
  )
}

export function applyPolymorphic(
  polymorphic: Values.Polymorphic,
  args: Array<Value>,
): Value {
  const width = globals.width
  const arity = polymorphic.parameters.length
  if (args.length !== arity) {
    let message = `[applyPolymorphic] arity mismatch`
    message += formatUnderTag(
      2,
      `polymorphic:`,
      prettyValue(width, polymorphic),
    )
    message += formatUnderTag(2, `args:`, prettyValues(width, args))
    throw new Error(message)
  }

  let env = polymorphic.env
  for (const [index, parameter] of polymorphic.parameters.entries()) {
    env = envPut(env, parameter, args[index])
  }

  return resultValue(evaluate(polymorphic.schema)(polymorphic.mod, env))
}
