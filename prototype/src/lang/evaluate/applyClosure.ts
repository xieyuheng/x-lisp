import * as S from "@xieyuheng/x-sexp.js"
import { globals } from "../../globals.ts"
import { formatUnderTag } from "../../helpers/format/formatUnderTag.ts"
import { emptyEnv, envUpdate } from "../env/index.ts"
import { match, patternize } from "../pattern/index.ts"
import { prettyExp, prettyValue } from "../pretty/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { apply } from "./apply.ts"
import { evaluate, resultValue } from "./evaluate.ts"

export function applyClosure(
  closure: Values.Closure,
  args: Array<Value>,
): Value {
  const maxWidth = globals.maxWidth
  const mod = closure.mod
  let env = closure.env
  for (const [index, parameter] of closure.parameters.entries()) {
    const pattern = patternize(parameter)(mod, env)
    const resultEnv = match(pattern, args[index])(emptyEnv())
    if (resultEnv === undefined) {
      let message = `[applyClosure] pattern mismatch`
      message += `\n  parameter index: ${index}`
      message += formatUnderTag(2, `parameter:`, prettyExp(maxWidth, parameter))
      message += formatUnderTag(
        2,
        `arg value:`,
        prettyValue(maxWidth, args[index]),
      )
      throw new S.ErrorWithMeta(message, parameter.meta)
    }

    env = envUpdate(env, resultEnv)
  }

  const arity = closure.parameters.length
  const restArgs = args.slice(arity)
  const result = resultValue(evaluate(closure.body)(closure.mod, env))
  if (restArgs.length === 0) {
    return result
  } else {
    return apply(result, restArgs)
  }
}
