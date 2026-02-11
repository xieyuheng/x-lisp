import * as L from "../index.ts"

export function stageClaim(mod: L.Mod, stmt: L.Stmt): void {
  if (stmt.kind === "Claim") {
    L.expandClaim(mod, stmt)
  }
}
