import {
  type Mod,
  modImport,
  modLookupPublicDefinition,
  modPublicDefinitions,
} from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"

export function stage2(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Import") {
    const importedMod = modImport(mod, stmt.path)
    for (const entry of stmt.entries) {
      const definition = modLookupPublicDefinition(importedMod, entry.name)
      if (definition === undefined) {
        let message = `(import) undefined name: ${entry.name}\n`
        message += `  path: ${stmt.path}\n`
        throw new Error(message)
      }

      const name = entry.rename || entry.name
      mod.imported.set(name, definition)
    }
  }

  if (stmt.kind === "Require") {
    const importedMod = modImport(mod, stmt.path)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      mod.imported.set(name, definition)
    }
  }
}
