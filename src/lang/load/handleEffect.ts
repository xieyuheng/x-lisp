import * as X from "@xieyuheng/x-data.js"
import { urlPathRelativeToCwd } from "../../utils/url/urlPathRelativeToCwd.ts"
import { emptyEnv } from "../env/index.ts"
import { evaluate } from "../evaluate/index.ts"
import { formatExp, formatValue } from "../format/index.ts"
import type { Mod } from "../mod/index.ts"
import type { Stmt } from "../stmt/index.ts"

export async function handleEffect(mod: Mod, stmt: Stmt): Promise<void> {
  if (stmt.kind === "Compute") {
    const value = evaluate(mod, emptyEnv(), stmt.exp)
    console.log(formatValue(value))
    return
  }

  if (stmt.kind === "Assert") {
    const value = evaluate(mod, emptyEnv(), stmt.exp)
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

function modReportSource(mod: Mod, span: X.Span): string {
  return `${urlPathRelativeToCwd(mod.url)}:${formatPosition(span.start)}`
}

function formatPosition(position: X.Position): string {
  return `${position.row + 1}:${position.column + 1}`
}
