import * as X from "@xieyuheng/x-data.js"
import { type Exp } from "../exp/index.ts"
import { formatExp, formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { evaluate, resultValue, type Effect } from "./evaluate.ts"

export function assertTrue(exp: Exp): Effect {
  return (mod, env) => {
    const value = resultValue(evaluate(exp)(mod, env))

    if (!Values.isBool(value)) {
      let message = `[assertTrue] fail on non boolean value\n`
      message += `  exp: ${formatExp(exp)}\n`
      message += `  value: ${formatValue(value)}\n`
      throw new X.ErrorWithMeta(message, exp.meta)
    }

    if (Values.isFalse(value)) {
      let message = `[assertTrue] fail\n`
      message += `  exp: ${formatExp(exp)}\n`
      throw new X.ErrorWithMeta(message, exp.meta)
    }

    return [env, Values.Void()]
  }
}
