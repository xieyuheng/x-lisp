import { envUpdate } from "../env/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"
import { apply } from "./apply.ts"
import { evaluate, resultValue } from "./evaluate.ts"

export function applyLambda(lambda: Values.Lambda, args: Array<Value>): Value {
  let env = lambda.env
  for (const [index, parameter] of lambda.parameters.entries()) {
    env = envUpdate(env, parameter, args[index])
  }

  const arity = lambda.parameters.length
  const restArgs = args.slice(arity)
  const result = resultValue(evaluate(lambda.body)(lambda.mod, env))
  if (restArgs.length === 0) {
    return result
  } else {
    return apply(result, restArgs)
  }
}
