import * as X from "@xieyuheng/x-data.js"
import process from "node:process"
import { equal } from "../equal/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { modReportSource } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { evaluate, resultValue, type Effect } from "./evaluate.ts"

export function assertNotEqual(lhs: Exp, rhs: Exp): Effect {
  return (mod, env) => {
    const lhsValue = resultValue(evaluate(lhs)(mod, env))
    const rhsValue = resultValue(evaluate(rhs)(mod, env))
    if (equal(lhsValue, rhsValue)) {
      let message = `[assertNotEqual] fail\n`
      message += `  lhs: ${formatExp(lhs)}\n`
      message += `  rhs: ${formatExp(rhs)}\n`
      message += `[source] ${modReportSource(mod, rhs.meta.span)}\n`
      message += X.spanReport(rhs.meta.span, rhs.meta.text)
      console.log(message)
      process.exit(1)
    }

    return [env, Values.Void()]
  }
}
