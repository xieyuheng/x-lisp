import { checkBlockTerminator } from "../check/checkBlockTerminator.ts"
import * as Definitions from "../definition/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"

export function stage1(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "DefineFunction") {
    const definition = Definitions.FunctionDefinition(
      stmt.name,
      stmt.parameters,
      stmt.blocks,
    )
    for (const block of stmt.blocks.values()) {
      checkBlockTerminator(block)
    }

    mod.definitions.set(stmt.name, definition)
  }
}
