import * as M from "../index.ts"

export function handleExempt(mod: M.Mod, stmt: M.Stmt): void {
  if (stmt.kind === "Exempt") {
    for (const name of stmt.names) {
      mod.exempted.add(name)
    }
  }
}
