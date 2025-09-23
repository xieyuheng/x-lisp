import { claim } from "../define/index.ts"
import { emptyEnv } from "../env/index.ts"
import { evaluate, resultValue } from "../evaluate/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"
import * as Values from "../value/index.ts"

export function stage3(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Claim") {
    const schema = Values.lazyWalk(
      resultValue(evaluate(stmt.schema)(mod, emptyEnv())),
    )
    claim(mod, stmt.name, schema)
  }

  if (stmt.kind === "Compute") {
    const value = Values.lazyWalk(
      resultValue(evaluate(stmt.exp)(mod, emptyEnv())),
    )

    if (!Values.isVoid(value)) {
      console.log(formatValue(value))
    }
  }
}
