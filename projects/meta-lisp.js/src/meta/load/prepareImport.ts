import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function prepareImport(mod: M.Mod, stmt: M.Stmt): void {
  if (!M.isAboutImport(stmt)) {
    return
  }

  const importedMod = M.importBy(stmt.path, mod)
  const definitionEntries = M.modPublicDefinitionEntries(importedMod)

  if (stmt.kind === "Import") {
    checkUndefinedNames(mod, importedMod, stmt.names, stmt.location)

    for (const [name, definition] of definitionEntries) {
      if (stmt.names.includes(name)) {
        M.modDefine(mod, name, definition)
      }
    }
  }

  if (stmt.kind === "ImportAll") {
    for (const [name, definition] of definitionEntries) {
      M.modDefine(mod, name, definition)
    }
  }

  if (stmt.kind === "ImportExcept") {
    for (const [name, definition] of definitionEntries) {
      if (!stmt.names.includes(name)) {
        M.modDefine(mod, name, definition)
      }
    }
  }

  if (stmt.kind === "ImportAs") {
    for (const [name, definition] of definitionEntries) {
      const fullName = `${stmt.prefix}${name}`
      M.modDefine(mod, fullName, definition)
    }
  }
}

function checkUndefinedNames(
  mod: M.Mod,
  importedMod: M.Mod,
  names: Array<string>,
  location?: S.SourceLocation,
): void {
  const definedNames = new Set(
    M.modPublicDefinitionEntries(importedMod).map(([key]) => key),
  )
  const undefinedNames = names.filter((name) => !definedNames.has(name))
  if (undefinedNames.length === 0) return

  let message = `[checkUndefinedNames] found undefined names during importing`
  message += `\n  mod: ${pathRelativeToCwd(mod.path)}`
  message += `\n  importing from mod: ${pathRelativeToCwd(importedMod.path)}`
  message += `\n  undefined names: [${undefinedNames.join(" ")}]`
  if (location) throw new S.ErrorWithSourceLocation(message, location)
  else throw new Error(message)
}
