import * as X from "@xieyuheng/x-sexp.js"
import { emptyEnv, envUpdate } from "../env/index.ts"
import { formatExp, formatValue } from "../format/index.ts"
import { match, patternize } from "../pattern/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"
import { apply } from "./apply.ts"
import { evaluate, resultValue } from "./evaluate.ts"

export function applyLambda(lambda: Values.Lambda, args: Array<Value>): Value {
  const mod = lambda.mod
  let env = lambda.env
  for (const [index, parameter] of lambda.parameters.entries()) {
    const pattern = patternize(parameter)(mod, env)
    const resultEnv = match(pattern, args[index])(emptyEnv())
    if (resultEnv === undefined) {
      let message = `[applyLambda] pattern mismatch`
      message += `\n  parameter index: ${index}`
      message += `\n  parameter pattern: ${formatExp(parameter)}`
      message += `\n  arg value: ${formatValue(args[index])}`
      throw new X.ErrorWithMeta(message, parameter.meta)
    }

    env = envUpdate(env, resultEnv)
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
