import * as M from "../index.ts"

export function loadImport(mod: M.Mod, scope: M.ModScope, stmt: M.Stmt): void {
  if (!M.isAboutImport(stmt)) {
    return
  }

  // const importedMod = M.importBy(stmt.path, mod)
  // const definitionEntries = M.modPublicDefinitionEntries(importedMod)

  // if (stmt.kind === "Import") {
  //   checkUndefinedNames(mod, importedMod, stmt.names, stmt.location)

  //   for (const [name, definition] of definitionEntries) {
  //     if (stmt.names.includes(name)) {
  //       M.modDefine(mod, name, definition)
  //     }
  //   }
  // }

  // if (stmt.kind === "ImportAs") {
  //   for (const [name, definition] of definitionEntries) {
  //     const fullName = `${stmt.prefix}${name}`
  //     M.modDefine(mod, fullName, definition)
  //   }
  // }
}
