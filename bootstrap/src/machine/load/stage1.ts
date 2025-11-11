import * as Definitions from "../definition/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"

export function stage1(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "DefineCode") {
    const definition = Definitions.CodeDefinition(mod, stmt.name, stmt.blocks)
    mod.definitions.set(stmt.name, definition)
  }
}
