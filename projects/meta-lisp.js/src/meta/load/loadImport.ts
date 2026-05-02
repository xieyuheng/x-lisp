import * as M from "../index.ts"

export function loadImport(
  mod: M.Mod,
  fragment: M.ModFragment,
  stmt: M.Stmt,
): void {
  if (stmt.kind === "Import") {
    for (const name of stmt.names) {
      fragment.importedNames.set(name, { modName: stmt.modName, name })
    }
  }

  if (stmt.kind === "ImportAs") {
    fragment.importedPrefixes.set(stmt.prefix, { modName: stmt.modName })
  }
}
