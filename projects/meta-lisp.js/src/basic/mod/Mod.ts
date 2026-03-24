import { type Stmt } from "../stmt/index.ts"

export type Mod = {
  path: string
  stmts: Array<Stmt>
  dependencies: Map<string, Mod>
}

export function createMod(path: string, dependencies: Map<string, Mod>): Mod {
  return {
    path,
    stmts: [],
    dependencies,
  }
}
