import * as X from "@xieyuheng/x-data.js"
import { equal } from "../equal/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatExp, formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { evaluate, resultValue, type Effect } from "./evaluate.ts"

export function assertEqual(lhs: Exp, rhs: Exp): Effect {
  return (mod, env) => {
    const lhsValue = resultValue(evaluate(lhs)(mod, env))
    const rhsValue = resultValue(evaluate(rhs)(mod, env))
    if (!equal(lhsValue, rhsValue)) {
      let message = `[assertEqual] fail\n`
      message += `  lhs exp: ${formatExp(lhs)}\n`
      message += `  rhs exp: ${formatExp(rhs)}\n`
      message += `  lhs value: ${formatValue(lhsValue)}\n`
      message += `  rhs value: ${formatValue(rhsValue)}\n`
      throw new X.ErrorWithMeta(message, rhs.meta)
    }

    return [env, Values.Void()]
  }
}
