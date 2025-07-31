import { emptyEnv } from "../env/index.ts"
import { evaluate } from "../evaluate/index.ts"
import { formatValue } from "../format/index.ts"
import type { Mod } from "../mod/index.ts"
import type { Stmt } from "../stmt/index.ts"

export async function handleEffect(mod: Mod, stmt: Stmt): Promise<void> {
  if (stmt.kind === "Compute") {
    const value = evaluate(mod, emptyEnv(), stmt.exp)
    console.log(formatValue(value))
    return
  }
}
