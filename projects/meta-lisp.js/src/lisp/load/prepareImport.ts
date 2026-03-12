import { pathRelativeToCwd } from "@xieyuheng/helpers.js/url"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"

export function handleImport(mod: L.Mod, stmt: L.Stmt): void {
  if (!L.isAboutImport(stmt)) {
    return
  }

  const importedMod = L.importBy(stmt.path, mod)
  const definitionEntries = L.modPublicDefinitionEntries(importedMod)

  if (stmt.kind === "Import") {
    checkUndefinedNames(mod, importedMod, stmt.names, stmt.meta)

    for (const [name, definition] of definitionEntries) {
      if (stmt.names.includes(name)) {
        L.modDefine(mod, name, definition)
      }
    }
  }

  if (stmt.kind === "ImportAll") {
    for (const [name, definition] of definitionEntries) {
      L.modDefine(mod, name, definition)
    }
  }

  if (stmt.kind === "ImportExcept") {
    for (const [name, definition] of definitionEntries) {
      if (!stmt.names.includes(name)) {
        L.modDefine(mod, name, definition)
      }
    }
  }

  if (stmt.kind === "ImportAs") {
    for (const [name, definition] of definitionEntries) {
      const fullName = `${stmt.prefix}${name}`
      L.modDefine(mod, fullName, definition)
    }
  }

  if (stmt.kind === "Include") {
    checkUndefinedNames(mod, importedMod, stmt.names, stmt.meta)

    for (const [name, definition] of definitionEntries) {
      if (stmt.names.includes(name)) {
        L.modDefine(mod, name, definition)
        mod.exported.add(name)
      }
    }
  }

  if (stmt.kind === "IncludeAll") {
    for (const [name, definition] of definitionEntries) {
      L.modDefine(mod, name, definition)
      mod.exported.add(name)
    }
  }

  if (stmt.kind === "IncludeExcept") {
    for (const [name, definition] of definitionEntries) {
      if (!stmt.names.includes(name)) {
        L.modDefine(mod, name, definition)
        mod.exported.add(name)
      }
    }
  }

  if (stmt.kind === "IncludeAs") {
    for (const [name, definition] of definitionEntries) {
      const fullName = `${stmt.prefix}${name}`
      L.modDefine(mod, fullName, definition)
      mod.exported.add(fullName)
    }
  }
}

function checkUndefinedNames(
  mod: L.Mod,
  importedMod: L.Mod,
  names: Array<string>,
  meta?: S.TokenMeta,
): void {
  const definedNames = new Set(
    L.modPublicDefinitionEntries(importedMod).map(([key]) => key),
  )
  const undefinedNames = names.filter((name) => !definedNames.has(name))
  if (undefinedNames.length === 0) return

  let message = `[checkUndefinedNames] found undefined names during importing`
  message += `\n  mod: ${pathRelativeToCwd(mod.path)}`
  message += `\n  importing from mod: ${pathRelativeToCwd(importedMod.path)}`
  message += `\n  undefined names: [${undefinedNames.join(" ")}]`
  if (meta) throw new S.ErrorWithMeta(message, meta)
  else throw new Error(message)
}
