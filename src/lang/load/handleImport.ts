import { modGet, modResolve, modSet } from "../mod/index.ts"
import type { Mod } from "../mod/Mod.ts"
import type { ImportEntry, Stmt } from "../stmt/Stmt.ts"
import { load } from "./load.ts"

export async function handleImport(mod: Mod, stmt: Stmt): Promise<void> {
  if (stmt.kind === "Import") {
    for (const entry of stmt.entries) {
      await importOne(mod, stmt.path, entry)
    }

    return
  }
}

async function importOne(
  mod: Mod,
  path: string,
  entry: ImportEntry,
): Promise<void> {
  const url = modResolve(mod, path)
  if (url.href === mod.url.href) {
    throw new Error(`[handleImport] A module can not import itself: ${path}\n`)
  }

  const importedMod = await load(url)

  const { name, rename } = entry
  const def = modGet(importedMod, name)
  if (def === undefined) {
    throw new Error(
      `[handleImport] I can not import undefined name: ${name}\n` +
        `  path: ${path}\n`,
    )
  }

  const localName = rename || name
  if (modGet(mod, localName)) {
    throw new Error(`[handleImport] I can not redefine name: ${localName}\n`)
  }

  modSet(mod, localName, def)
}
