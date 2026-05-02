import * as M from "../index.ts"

export function executeExempt(mod: M.Mod, scope: M.ModScope, stmt: M.Stmt): void {
  if (stmt.kind === "Exempt") {
    for (const name of stmt.names) {
      mod.exempted.add(name)
    }
  }
}
