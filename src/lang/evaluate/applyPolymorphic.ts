import { envSetValue } from "../env/index.ts"
import { formatValue, formatValues } from "../format/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"
import { evaluate, resultValue } from "./evaluate.ts"

export function applyPolymorphic(
  polymorphic: Values.Polymorphic,
  args: Array<Value>,
): Value {
  const arity = polymorphic.parameters.length
  if (args.length !== arity) {
    let message = `[applyPolymorphic] arity mismatch\n`
    message += `  polymorphic: ${formatValue(polymorphic)}\n`
    message += `  args: [${formatValues(args)}]\n`
    throw new Error(message)
  }

  let env = polymorphic.env
  for (const [index, parameter] of polymorphic.parameters.entries()) {
    env = envSetValue(env, parameter, args[index])
  }

  return resultValue(evaluate(polymorphic.schema)(polymorphic.mod, env))
}
