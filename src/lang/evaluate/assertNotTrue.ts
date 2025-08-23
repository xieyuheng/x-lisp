import * as X from "@xieyuheng/x-data.js"
import process from "node:process"
import { type Exp } from "../exp/index.ts"
import { formatExp, formatValue } from "../format/index.ts"
import { modReportSource } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { evaluate, resultValue, type Effect } from "./evaluate.ts"

export function assertNotTrue(exp: Exp): Effect {
  return (mod, env) => {
    const value = resultValue(evaluate(exp)(mod, env))

    if (value.kind !== "Bool") {
      let message = `[assertNotTrue] fail on non boolean value\n`
      message += `  exp: ${formatExp(exp)}\n`
      message += `  value: ${formatValue(value)}\n`
      message += `[source] ${modReportSource(mod, exp.meta.span)}\n`
      message += X.spanReport(exp.meta.span, exp.meta.text)
      console.log(message)
      process.exit(1)
    }

    if (value.kind === "Bool" && value.content === true) {
      let message = `[assertNotTrue] fail\n`
      message += `  exp: ${formatExp(exp)}\n`
      message += `[source] ${modReportSource(mod, exp.meta.span)}\n`
      message += X.spanReport(exp.meta.span, exp.meta.text)
      console.log(message)
      process.exit(1)
    }

    return [env, Values.Void()]
  }
}
