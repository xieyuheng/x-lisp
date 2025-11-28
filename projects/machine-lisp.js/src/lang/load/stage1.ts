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
    mod.definitions.set(
      stmt.name,
      Definitions.CodeDefinition(mod, stmt.name, stmt.blocks, stmt.meta),
    )
  }

  if (stmt.kind === "DefineData") {
    mod.definitions.set(
      stmt.name,
      Definitions.DataDefinition(mod, stmt.name, stmt.directives, stmt.meta),
    )
  }

  if (stmt.kind === "DefineSpace") {
    mod.definitions.set(
      stmt.name,
      Definitions.SpaceDefinition(mod, stmt.name, stmt.size, stmt.meta),
    )
  }
}
