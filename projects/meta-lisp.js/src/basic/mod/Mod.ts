import { type Stmt } from "../stmt/index.ts"

export type Mod = {
  path: string
  stmts: Array<Stmt>
}

export function createMod(path: string): Mod {
  return {
    path,
    stmts: [],
  }
}

export function modLookupStmt(mod: Mod, name: string): Stmt | undefined {
  return mod.stmts.find((stmt) => stmt.name === name)
}
