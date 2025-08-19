import { claim } from "../define/index.ts"
import { emptyEnv } from "../env/index.ts"
import { evaluate, resultValue } from "../evaluate/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import type { Stmt } from "../stmt/index.ts"

export function stage3(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Claim") {
    claim(mod, stmt.name, resultValue(evaluate(stmt.schema)(mod, emptyEnv())))
  }

  if (stmt.kind === "Compute") {
    const value = resultValue(evaluate(stmt.exp)(mod, emptyEnv()))
    if (value.kind !== "Void") {
      console.log(formatValue(value))
    }
  }
}
