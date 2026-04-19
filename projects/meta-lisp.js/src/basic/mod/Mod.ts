import { type Stmt } from "../stmt/index.ts"

export type Mod = {
  stmts: Array<Stmt>
}

export function createMod(): Mod {
  return {
    stmts: [],
  }
}

export function modLookupStmt(mod: Mod, name: string): Stmt | undefined {
  return mod.stmts.find((stmt) => stmt.name === name)
}
