import { modGet, modResolve, modSet } from "../mod/index.ts"
import {  type Mod, modOwnDefs } from "../mod/Mod.ts"
import type { ImportEntry, Stmt } from "../stmt/Stmt.ts"
import { load } from "./load.ts"

export async function handleImport(mod: Mod, stmt: Stmt): Promise<void> {
  if (stmt.kind === "Import") {
    for (const entry of stmt.entries) {
      await importOne(mod, stmt.path, entry)
    }
  }

  if (stmt.kind === "Require") {
    await importAll(mod, stmt.path)
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
      `[importOne] I can not import undefined name: ${name}\n` +
        `  path: ${path}\n`,
    )
  }

  const localName = rename || name
  if (modGet(mod, localName)) {
    throw new Error(`[importOne] I can not redefine name: ${localName}\n`)
  }

  modSet(mod, localName, def)
}

async function importAll(
  mod: Mod,
  path: string,
): Promise<void> {
  const url = modResolve(mod, path)
  if (url.href === mod.url.href) {
    throw new Error(`[importAll] A module can not import itself: ${path}\n`)
  }

  const importedMod = await load(url)
  for (const def of modOwnDefs(importedMod)) {
    if (modGet(mod, def.name)) {
      throw new Error(`[importAll] I can not redefine name: ${def.name}\n`)
    }

    modSet(mod, def.name, def)
  }
}
