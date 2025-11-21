import { envPut } from "../env/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { evaluate, resultValue } from "./evaluate.ts"

export function applyVariadicClosure(
  variadicClosure: Values.VariadicClosure,
  args: Array<Value>,
): Value {
  const env = envPut(
    variadicClosure.env,
    variadicClosure.variadicParameter,
    Values.List(args),
  )
  return resultValue(evaluate(variadicClosure.body)(variadicClosure.mod, env))
}
