import * as M from "../index.ts"

export function handleExport(mod: M.Mod, stmt: M.Stmt): void {
  if (stmt.kind === "Export") {
    for (const name of stmt.names) {
      mod.exported.add(name)
    }
  }

  if (stmt.kind === "ExportAll") {
    for (const definition of M.modOwnDefinitions(mod)) {
      mod.exported.add(definition.name)
    }
  }

  if (stmt.kind === "ExportExcept") {
    for (const definition of M.modOwnDefinitions(mod)) {
      if (!stmt.names.includes(definition.name)) {
        mod.exported.add(definition.name)
      }
    }
  }
}
