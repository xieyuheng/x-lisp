import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import type { Exp } from "../exp/index.ts"

export type Instr =
  | Assign
  | Perform

export type Assign = {
  op: "Assign"
  dest: string
  exp: Exp
  meta?: Meta
}

export function Assign(dest: string, exp: Exp, meta?: Meta): Assign {
  return {
    op: "Assign",
    dest,
    exp,
    meta,
  }
}

export type Perform = {
  op: "Perform"
  exp: Exp
  meta?: Meta
}

export function Perform(exp: Exp, meta?: Meta): Perform {
  return {
    op: "Perform",
    exp,
    meta,
  }
}
