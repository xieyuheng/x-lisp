import type { AboutExport, AboutImport, AboutModule, Stmt } from "./index.ts"

export function isAboutImport(stmt: Stmt): stmt is AboutImport {
  return (
    stmt.kind === "Import" ||
    stmt.kind === "ImportAll" ||
    stmt.kind === "ImportAs" ||
    stmt.kind === "IncludeAll" ||
    stmt.kind === "Include" ||
    stmt.kind === "IncludeExcept" ||
    stmt.kind === "IncludeAs"
  )
}

export function isAboutExport(stmt: Stmt): stmt is AboutExport {
  return (
    stmt.kind === "Export" ||
    stmt.kind === "ExportAll" ||
    stmt.kind === "ExportExcept"
  )
}

export function isAboutModule(stmt: Stmt): stmt is AboutModule {
  return isAboutImport(stmt) || isAboutExport(stmt)
}
