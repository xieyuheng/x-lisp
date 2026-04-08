import * as M from "../index.ts"

export function loadImport(mod: M.Mod, scope: M.ModScope, stmt: M.Stmt): void {
  if (stmt.kind === "Import") {
    for (const name of stmt.names) {
      scope.importedNames.set(name, { modName: stmt.modName, name })
    }
  }

  if (stmt.kind === "ImportAs") {
    scope.importedPrefixes.set(stmt.prefix, { modName: stmt.modName })
  }
}
