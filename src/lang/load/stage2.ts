import { type Mod, modImport, modOwnDefs } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"

export function stage2(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Import") {
    const importedMod = modImport(mod, stmt.path)
    for (const entry of stmt.entries) {
      const def = importedMod.defs.get(entry.name)
      if (def === undefined) {
        let message = `(import) I can not import undefined name: ${entry.name}\n`
        message += `  path: ${stmt.path}\n`
        throw new Error(message)
      }

      const name = entry.rename || entry.name
      mod.defs.set(name, def)
    }
  }

  if (stmt.kind === "Require") {
    const importedMod = modImport(mod, stmt.path)
    for (const def of modOwnDefs(importedMod)) {
      mod.defs.set(def.name, def)
    }
  }
}
