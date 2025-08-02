import * as X from "@xieyuheng/x-data.js"
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
      console.log(
        `[assert] fail on non boolean value\n` +
          `  value: ${formatValue(value)}\n` +
          `  exp: ${formatExp(stmt.exp)}\n`,
      )

      if (mod.text) {
        console.log(X.spanReport(stmt.meta.span, mod.text))
      }
    }

    if (value.kind === "Bool" && value.content === false) {
      console.log(`[assert] fail\n` + `  exp: ${formatExp(stmt.exp)}\n`)

      if (mod.text) {
        console.log(X.spanReport(stmt.meta.span, mod.text))
      }
    }

    return
  }
}
