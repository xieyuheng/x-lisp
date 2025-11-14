import type { AboutModule, Stmt } from "./index.ts"

export function isAboutModule(stmt: Stmt): stmt is AboutModule {
  return stmt.kind === "Export" || stmt.kind === "Extern"
}
