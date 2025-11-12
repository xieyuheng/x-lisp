import * as Definitions from "../definition/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"

export function stage1(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Export") {
    for (const name of stmt.names) {
      mod.exported.add(name)
    }
  }

  if (stmt.kind === "DefineCode") {
    const definition = Definitions.CodeDefinition(
      mod,
      stmt.name,
      stmt.blocks,
      stmt.meta,
    )
    mod.definitions.set(stmt.name, definition)
  }

  if (stmt.kind === "DefineData") {
    const definition = Definitions.DataDefinition(
      mod,
      stmt.name,
      stmt.chunks,
      stmt.meta,
    )
    mod.definitions.set(stmt.name, definition)
  }
}
