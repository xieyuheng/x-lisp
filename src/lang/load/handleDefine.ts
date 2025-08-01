import { emptyEnv } from "../env/index.ts"
import { modGet, modSet, type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"
import * as Values from "../value/index.ts"

export async function handleDefine(mod: Mod, stmt: Stmt): Promise<void> {
  if (stmt.kind === "Define") {
    if (modGet(mod, stmt.name)) {
      throw new Error(`[define] I can not redefine name: ${stmt.name}`)
    }

    modSet(mod, stmt.name, {
      mod,
      name: stmt.name,
      value: Values.Lazy(mod, emptyEnv(), stmt.exp),
    })

    return
  }
}
