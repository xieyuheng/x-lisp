import type { AboutImport, Stmt } from "./index.ts"

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
