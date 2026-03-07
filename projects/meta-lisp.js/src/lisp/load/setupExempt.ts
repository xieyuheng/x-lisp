import * as L from "../index.ts"

export function handleExempt(mod: L.Mod, stmt: L.Stmt): void {
  if (stmt.kind === "Exempt") {
    for (const name of stmt.names) {
      mod.exempted.add(name)
    }
  }
}
