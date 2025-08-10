import { type Mod, modImport, modPublicDefinitions } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"

export function stage2(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Import") {
    const importedMod = modImport(mod, stmt.path)
    for (const entry of stmt.entries) {
      const definition = importedMod.definitions.get(entry.name)
      if (definition === undefined) {
        let message = `(import) I can not import undefined name: ${entry.name}\n`
        message += `  path: ${stmt.path}\n`
        throw new Error(message)
      }

      const name = entry.rename || entry.name
      mod.definitions.set(name, definition)
    }
  }

  if (stmt.kind === "Require") {
    const importedMod = modImport(mod, stmt.path)
    for (const definition of modPublicDefinitions(importedMod)) {
      mod.definitions.set(definition.name, definition)
    }
  }
}
