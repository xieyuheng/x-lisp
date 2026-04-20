import { type Line } from "../line/index.ts"

export type Mod = {
  lines: Array<Line>
}

export function createMod(): Mod {
  return {
    lines: [],
  }
}
