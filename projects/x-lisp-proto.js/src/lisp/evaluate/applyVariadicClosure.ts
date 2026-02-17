import { envPut } from "../env/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { evaluate, resultValue } from "./evaluate.ts"

export function applyVariadicClosure(
  variadicClosure: Values.VariadicClosureValue,
  args: Array<Value>,
): Value {
  const env = envPut(
    variadicClosure.env,
    variadicClosure.variadicParameter,
    Values.ListValue(args),
  )
  return resultValue(evaluate(variadicClosure.body)(variadicClosure.mod, env))
}
