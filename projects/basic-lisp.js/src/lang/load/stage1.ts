import { checkBlockTerminator } from "../check/index.ts"
import * as Definitions from "../definition/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"

export function stage1(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Export") {
    for (const name of stmt.names) {
      mod.exported.add(name)
    }
  }

  if (stmt.kind === "DefineFunction") {
    const definition = Definitions.FunctionDefinition(
      mod,
      stmt.name,
      stmt.blocks,
    )
    for (const block of stmt.blocks.values()) {
      checkBlockTerminator(block)
    }

    mod.definitions.set(stmt.name, definition)
  }

  if (stmt.kind === "DefineVariable") {
    mod.definitions.set(
      stmt.name,
      Definitions.VariableDefinition(mod, stmt.name, stmt.value),
    )
  }
}
