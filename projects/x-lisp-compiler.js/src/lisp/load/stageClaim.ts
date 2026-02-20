import * as L from "../index.ts"

export function stageClaim(mod: L.Mod, stmt: L.Stmt): void {
  if (stmt.kind === "Claim") {
    const typeValue = L.resultValue(L.evaluate(mod, L.emptyEnv(), stmt.type))
    L.modClaim(mod, stmt.name, typeValue)
  }
}
