import * as X from "@xieyuheng/x-data.js"
import { urlRelativeToCwd } from "../../utils/url/urlRelativeToCwd.ts"
import { include } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import {
  type Definition,
  type Mod,
  modLookupPublicDefinition,
  modPublicDefinitions,
} from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { importByMod } from "./importByMod.ts"

function checkNotRedefine(
  mod: Mod,
  name: string,
  definition: Definition,
  meta: X.TokenMeta,
): void {
  const found = mod.defined.get(name)
  if (found === undefined) return
  if (found === definition) return

  let message = `[checkNotRedefine] I can not redefine name: ${name}\n`
  message += `  new value: ${formatValue(definition.value)}\n`
  message += `  old value: ${formatValue(found.value)}\n`
  throw new X.ErrorWithMeta(message, meta)
}

export function stage2(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Import") {
    const importedMod = importByMod(stmt.path, mod)
    for (const entry of stmt.entries) {
      const definition = modLookupPublicDefinition(importedMod, entry.name)
      if (definition === undefined) {
        let message = `(import) undefined name: ${entry.name}\n`
        message += `  path: ${stmt.path}\n`
        message += `  by mod: ${urlRelativeToCwd(mod.url)}\n`
        throw new X.ErrorWithMeta(message, stmt.meta)
      }

      const name = entry.rename || entry.name
      checkNotRedefine(mod, name, definition, stmt.meta)
      mod.defined.set(name, definition)
    }
  }

  if (stmt.kind === "ImportAll") {
    const importedMod = importByMod(stmt.path, mod)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      checkNotRedefine(mod, name, definition, stmt.meta)
      mod.defined.set(name, definition)
    }
  }

  if (stmt.kind === "ImportAs") {
    const importedMod = importByMod(stmt.path, mod)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      checkNotRedefine(mod, `${stmt.name}/${name}`, definition, stmt.meta)
      mod.defined.set(`${stmt.name}/${name}`, definition)
    }
  }

  if (stmt.kind === "IncludeAll") {
    const importedMod = importByMod(stmt.path, mod)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      checkNotRedefine(mod, name, definition, stmt.meta)
      include(mod, name, definition)
    }
  }

  if (stmt.kind === "Include") {
    const importedMod = importByMod(stmt.path, mod)
    for (const name of stmt.names) {
      const definition = modLookupPublicDefinition(importedMod, name)
      if (definition === undefined) {
        let message = `(include) undefined name: ${name}\n`
        message += `  path: ${stmt.path}\n`
        message += `  by mod: ${urlRelativeToCwd(mod.url)}\n`
        throw new X.ErrorWithMeta(message, stmt.meta)
      }

      checkNotRedefine(mod, name, definition, stmt.meta)
      include(mod, name, definition)
    }
  }

  if (stmt.kind === "IncludeExcept") {
    const importedMod = importByMod(stmt.path, mod)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      if (!stmt.names.includes(name)) {
        checkNotRedefine(mod, name, definition, stmt.meta)
        include(mod, name, definition)
      }
    }
  }

  if (stmt.kind === "IncludeAs") {
    const importedMod = importByMod(stmt.path, mod)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      checkNotRedefine(mod, `${stmt.name}/${name}`, definition, stmt.meta)
      include(mod, `${stmt.name}/${name}`, definition)
    }
  }
}
