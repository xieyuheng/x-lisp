import * as L from "../index.ts"

export function stageExport(mod: L.Mod, stmt: L.Stmt): void {
  if (stmt.kind === "Export") {
    for (const name of stmt.names) {
      mod.exported.add(name)
    }
  }

  if (stmt.kind === "ExportAll") {
    for (const definition of L.modOwnDefinitions(mod)) {
      mod.exported.add(definition.name)
    }
  }

  if (stmt.kind === "ExportExcept") {
    for (const definition of L.modOwnDefinitions(mod)) {
      if (!stmt.names.includes(definition.name)) {
        mod.exported.add(definition.name)
      }
    }
  }
}
