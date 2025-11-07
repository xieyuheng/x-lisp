import { envPut } from "../env/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { evaluate, resultValue } from "./evaluate.ts"

export function applyVariadicLambda(
  variadicLambda: Values.VariadicLambda,
  args: Array<Value>,
): Value {
  const env = envPut(
    variadicLambda.env,
    variadicLambda.variadicParameter,
    Values.List(args),
  )
  return resultValue(evaluate(variadicLambda.body)(variadicLambda.mod, env))
}
