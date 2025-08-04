import * as X from "@xieyuheng/x-data.js"
import { emptyEnv } from "../env/index.ts"
import { evaluate, resultValue } from "../evaluate/index.ts"
import { formatExp, formatValue } from "../format/index.ts"
import { modReportSource, type Mod } from "../mod/index.ts"
import type { Stmt } from "../stmt/index.ts"

export async function handleEffect(mod: Mod, stmt: Stmt): Promise<void> {
  if (stmt.kind === "Compute") {
    const value = resultValue(evaluate(stmt.exp)(mod, emptyEnv()))
    console.log(formatValue(value))
    return
  }

  if (stmt.kind === "Assert") {
    const value = resultValue(evaluate(stmt.exp)(mod, emptyEnv()))
    if (value.kind !== "Bool") {
      let message =
        `[assert] fail on non boolean value\n` +
        `  value: ${formatValue(value)}\n` +
        `  exp: ${formatExp(stmt.exp)}\n`
      message += `[source] ${modReportSource(mod, stmt.meta.span)}\n`
      if (mod.text) message += X.spanReport(stmt.meta.span, mod.text)
      console.log(message)
    }

    if (value.kind === "Bool" && value.content === false) {
      let message = `[assert] fail\n` + `  exp: ${formatExp(stmt.exp)}\n`
      message += `[source] ${modReportSource(mod, stmt.meta.span)}\n`
      if (mod.text) message += X.spanReport(stmt.meta.span, mod.text)
      console.log(message)
    }

    return
  }
}
