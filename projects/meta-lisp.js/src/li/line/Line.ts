import type { Exp } from "../exp/index.ts"

export type Line = {
  op: string
  path: string
  args: Array<Exp>
}

export function Line(op: string, path: string, args: Array<Exp>): Line {
  return {
    op,
    path,
    args,
  }
}
