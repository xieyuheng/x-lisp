import { formatIndent } from "@xieyuheng/helpers.js/format"
import { createUrl, urlRelativeToCwd } from "@xieyuheng/helpers.js/url"
import * as S from "@xieyuheng/sexp.js"
import { type Definition } from "../definition/index.ts"
import { formatDefinition } from "../format/index.ts"
import { modPublicDefinitionEntries, type Mod } from "../mod/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { load } from "./index.ts"
import { resolveModPath } from "./resolveModPath.ts"

export function stage2(mod: Mod, stmt: Stmt): void {
  if (!Stmts.isAboutImport(stmt)) {
    return
  }

  const importedMod = importBy(stmt.path, mod)
  const definitionEntries = modPublicDefinitionEntries(importedMod)

  if (stmt.kind === "Import") {
    checkUndefinedNames(mod, importedMod, stmt.names, stmt.meta)

    for (const [name, definition] of definitionEntries) {
      if (stmt.names.includes(name)) {
        checkRedefine(mod, importedMod, name, definition, stmt.meta)
        mod.definitions.set(name, definition)
      }
    }
  }

  if (stmt.kind === "ImportAll") {
    for (const [name, definition] of definitionEntries) {
      checkRedefine(mod, importedMod, name, definition, stmt.meta)
      mod.definitions.set(name, definition)
    }
  }

  if (stmt.kind === "ImportExcept") {
    for (const [name, definition] of definitionEntries) {
      if (!stmt.names.includes(name)) {
        checkRedefine(mod, importedMod, name, definition, stmt.meta)
        mod.definitions.set(name, definition)
      }
    }
  }

  if (stmt.kind === "ImportAs") {
    for (const [name, definition] of definitionEntries) {
      const fullName = `${stmt.prefix}${name}`
      checkRedefine(mod, importedMod, fullName, definition, stmt.meta)
      mod.definitions.set(fullName, definition)
    }
  }

  if (stmt.kind === "Include") {
    checkUndefinedNames(mod, importedMod, stmt.names, stmt.meta)

    for (const [name, definition] of definitionEntries) {
      if (stmt.names.includes(name)) {
        checkRedefine(mod, importedMod, name, definition, stmt.meta)
        mod.definitions.set(name, definition)
        mod.exported.add(name)
      }
    }
  }

  if (stmt.kind === "IncludeAll") {
    for (const [name, definition] of definitionEntries) {
      checkRedefine(mod, importedMod, name, definition, stmt.meta)
      mod.definitions.set(name, definition)
      mod.exported.add(name)
    }
  }

  if (stmt.kind === "IncludeExcept") {
    for (const [name, definition] of definitionEntries) {
      if (!stmt.names.includes(name)) {
        checkRedefine(mod, importedMod, name, definition, stmt.meta)
        mod.definitions.set(name, definition)
        mod.exported.add(name)
      }
    }
  }

  if (stmt.kind === "IncludeAs") {
    for (const [name, definition] of definitionEntries) {
      const fullName = `${stmt.prefix}${name}`
      checkRedefine(mod, importedMod, fullName, definition, stmt.meta)
      mod.definitions.set(fullName, definition)
      mod.exported.add(fullName)
    }
  }
}

function importBy(path: string, mod: Mod): Mod {
  let url = urlRelativeToMod(path, mod)
  if (url.protocol === "file:") {
    url.pathname = resolveModPath(url.pathname)
  }

  return load(url, mod.dependencies)
}

function urlRelativeToMod(path: string, mod: Mod): URL {
  if (mod.url.protocol === "file:") {
    const url = new URL(path, mod.url)
    if (url.href === mod.url.href) {
      let message = `[urlRelativeToMod] A module can not import itself: ${path}`
      throw new Error(message)
    }

    return url
  }

  return createUrl(path)
}

function checkUndefinedNames(
  mod: Mod,
  importedMod: Mod,
  names: Array<string>,
  meta?: S.TokenMeta,
): void {
  const definedNames = new Set(
    modPublicDefinitionEntries(importedMod).map(([key]) => key),
  )
  const undefinedNames = names.filter((name) => !definedNames.has(name))
  if (undefinedNames.length === 0) return

  let message = `[checkUndefinedNames] found undefined names during importing`
  message += `\n  mod: ${urlRelativeToCwd(mod.url)}`
  message += `\n  importing from mod: ${urlRelativeToCwd(importedMod.url)}`
  message += `\n  undefined names: [${undefinedNames.join(" ")}]`
  if (meta) throw new S.ErrorWithMeta(message, meta)
  else throw new Error(message)
}

function checkRedefine(
  mod: Mod,
  importedMod: Mod,
  name: string,
  definition: Definition,
  meta?: S.TokenMeta,
): void {
  const found = mod.definitions.get(name)
  if (found === undefined) return
  if (found === definition) return

  let message = `[checkRedefine] can not redefine during importing`
  message += `\n  mod: ${urlRelativeToCwd(mod.url)}`
  message += `\n  importing from mod: ${urlRelativeToCwd(importedMod.url)}`
  message += `\n  name: ${name}`
  message += `\n  old definition:`
  message += formatIndent(4, formatDefinition(found))
  message += `\n  new definition:`
  message += formatIndent(4, formatDefinition(definition))
  if (meta) throw new S.ErrorWithMeta(message, meta)
  else throw new Error(message)
}
