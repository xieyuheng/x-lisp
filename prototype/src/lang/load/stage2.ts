import * as S from "@xieyuheng/x-sexp.js"
import { formatIndent } from "../../helpers/format/formatIndent.ts"
import { urlRelativeToCwd } from "../../helpers/url/urlRelativeToCwd.ts"
import { include } from "../define/index.ts"
import { formatDefinition, type Definition } from "../definition/index.ts"
import {
  modLookupPublicDefinition,
  modPublicDefinitions,
  type Mod,
} from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { importByMod } from "./importByMod.ts"

function checkRedefine(
  mod: Mod,
  name: string,
  definition: Definition,
  meta: S.TokenMeta,
): void {
  const found = mod.definitions.get(name)
  if (found === undefined) return
  if (found === definition) return

  let message = `[checkRedefine] can not redefine name: ${name}`
  message += `\n  old definition:`
  message += formatIndent(4, formatDefinition(found))
  message += `\n  new definition:`
  message += formatIndent(4, formatDefinition(definition))
  throw new S.ErrorWithMeta(message, meta)
}

export function stage2(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Import") {
    const importedMod = importByMod(stmt.path, mod)
    for (const name of stmt.names) {
      const definition = modLookupPublicDefinition(importedMod, name)
      if (definition === undefined) {
        let message = `(import) undefined name: ${name}`
        message += `\n  path: ${stmt.path}`
        message += `\n  by mod: ${urlRelativeToCwd(mod.url)}`
        throw new S.ErrorWithMeta(message, stmt.meta)
      }

      checkRedefine(mod, name, definition, stmt.meta)
      mod.definitions.set(name, definition)
    }
  }

  if (stmt.kind === "ImportAll") {
    const importedMod = importByMod(stmt.path, mod)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      checkRedefine(mod, name, definition, stmt.meta)
      mod.definitions.set(name, definition)
    }
  }

  if (stmt.kind === "ImportAs") {
    const importedMod = importByMod(stmt.path, mod)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      checkRedefine(mod, `${stmt.name}/${name}`, definition, stmt.meta)
      mod.definitions.set(`${stmt.name}/${name}`, definition)
    }
  }

  if (stmt.kind === "IncludeAll") {
    const importedMod = importByMod(stmt.path, mod)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      checkRedefine(mod, name, definition, stmt.meta)
      include(mod, name, definition)
    }
  }

  if (stmt.kind === "Include") {
    const importedMod = importByMod(stmt.path, mod)
    for (const name of stmt.names) {
      const definition = modLookupPublicDefinition(importedMod, name)
      if (definition === undefined) {
        let message = `(include) undefined name: ${name}`
        message += `\n  path: ${stmt.path}`
        message += `\n  by mod: ${urlRelativeToCwd(mod.url)}`
        throw new S.ErrorWithMeta(message, stmt.meta)
      }

      checkRedefine(mod, name, definition, stmt.meta)
      include(mod, name, definition)
    }
  }

  if (stmt.kind === "IncludeExcept") {
    const importedMod = importByMod(stmt.path, mod)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      if (!stmt.names.includes(name)) {
        checkRedefine(mod, name, definition, stmt.meta)
        include(mod, name, definition)
      }
    }
  }

  if (stmt.kind === "IncludeAs") {
    const importedMod = importByMod(stmt.path, mod)
    for (const [name, definition] of modPublicDefinitions(
      importedMod,
    ).entries()) {
      checkRedefine(mod, `${stmt.name}/${name}`, definition, stmt.meta)
      include(mod, `${stmt.name}/${name}`, definition)
    }
  }
}
