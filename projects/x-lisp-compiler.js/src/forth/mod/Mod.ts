import { type Stmt } from "../stmt/index.ts"

export type Mod = {
  url: URL
  stmt: Array<Stmt>
  dependencies: Map<string, Mod>
}

export function createMod(url: URL, dependencies: Map<string, Mod>): Mod {
  return {
    url,
    stmt: [],
    dependencies,
  }
}
