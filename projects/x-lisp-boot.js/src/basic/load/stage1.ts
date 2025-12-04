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
      stmt.meta,
    )

    for (const block of stmt.blocks.values()) {
      checkBlockTerminator(block)
    }

    mod.definitions.set(stmt.name, definition)
  }

  if (stmt.kind === "DefineSetup") {
    const definition = Definitions.SetupDefinition(
      mod,
      stmt.name,
      stmt.blocks,
      stmt.meta,
    )

    for (const block of stmt.blocks.values()) {
      checkBlockTerminator(block)
    }

    mod.definitions.set(stmt.name, definition)
  }

  if (stmt.kind === "DefineVariable") {
    mod.definitions.set(
      stmt.name,
      Definitions.VariableDefinition(mod, stmt.name, stmt.value, stmt.meta),
    )
  }

  if (stmt.kind === "DefineMetadata") {
    mod.definitions.set(
      stmt.name,
      Definitions.MetadataDefinition(
        mod,
        stmt.name,
        stmt.attributes,
        stmt.meta,
      ),
    )
  }

  if (stmt.kind === "DefinePlaceholder") {
    mod.definitions.set(
      stmt.name,
      Definitions.PlaceholderDefinition(mod, stmt.name, stmt.meta),
    )
  }
}
