import { type Line } from "../line/index.ts"

export type Mod = {
  path: string
  lines: Array<Line>
}

export function createMod(path: string): Mod {
  return {
    path,
    lines: [],
  }
}
