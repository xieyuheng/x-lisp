import { modGet, modImport, modResolve, modSet } from "../mod/index.ts"
import { type Mod, modOwnDefs } from "../mod/Mod.ts"
import type { ImportEntry, Stmt } from "../stmt/Stmt.ts"
import { load } from "./load.ts"

export async function handleImport(mod: Mod, stmt: Stmt): Promise<void> {
  if (stmt.kind === "Import") {
    const importedMod = await modImport(mod, stmt.path)
    for (const entry of stmt.entries) {
      const def = modGet(importedMod, entry.name)
      if (def === undefined) {
        throw new Error(
          `[handleImport] I can not import undefined name: ${entry.name}\n` +
          `  path: ${stmt.path}\n`,
        )
      }

      const name = entry.rename || entry.name
      if (modGet(mod, name)) {
        throw new Error(`[handleImport] I can not redefine name: ${name}\n`)
      }

      modSet(mod, name, def)
    }
  }

  if (stmt.kind === "Require") {
    const importedMod = await modImport(mod, stmt.path)
    for (const def of modOwnDefs(importedMod)) {
      if (modGet(mod, def.name)) {
        throw new Error(`[handleImport] I can not redefine name: ${def.name}\n`)
      }

      modSet(mod, def.name, def)
    }
  }
}
