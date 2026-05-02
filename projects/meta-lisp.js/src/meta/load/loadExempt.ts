import * as M from "../index.ts"

export function loadExempt(
  mod: M.Mod,
  fragment: M.ModFragment,
  stmt: M.Stmt,
): void {
  if (stmt.kind === "Exempt") {
    for (const name of stmt.names) {
      mod.exempted.add(name)
    }
  }
}
