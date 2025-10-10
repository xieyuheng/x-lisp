import { envPut } from "../env/index.ts"
import { formatValue, formatValues } from "../format/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"
import { evaluate, resultValue } from "./evaluate.ts"

const anything = Values.PrimitiveFunction("anything?", 1, () =>
  Values.Bool(true),
)
export function applyPolymorphicWithAnythings(
  polymorphic: Values.Polymorphic,
): Value {
  return applyPolymorphic(
    polymorphic,
    polymorphic.parameters.map((_) => anything),
  )
}

export function applyPolymorphic(
  polymorphic: Values.Polymorphic,
  args: Array<Value>,
): Value {
  const arity = polymorphic.parameters.length
  if (args.length !== arity) {
    let message = `[applyPolymorphic] arity mismatch`
    message += `\n  polymorphic: ${formatValue(polymorphic)}`
    message += `\n  args: [${formatValues(args)}]`
    throw new Error(message)
  }

  let env = polymorphic.env
  for (const [index, parameter] of polymorphic.parameters.entries()) {
    env = envPut(env, parameter, args[index])
  }

  return resultValue(evaluate(polymorphic.schema)(polymorphic.mod, env))
}
