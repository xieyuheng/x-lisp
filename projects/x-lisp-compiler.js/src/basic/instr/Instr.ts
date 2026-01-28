import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import type { Exp } from "../exp/index.ts"

export type Instr = Assign | Perform | Branch | Goto | Return

export type Assign = {
  kind: "Assign"
  dest: string
  exp: Exp
  meta?: Meta
}

export function Assign(dest: string, exp: Exp, meta?: Meta): Assign {
  return {
    kind: "Assign",
    dest,
    exp,
    meta,
  }
}

export type Perform = {
  kind: "Perform"
  exp: Exp
  meta?: Meta
}

export function Perform(exp: Exp, meta?: Meta): Perform {
  return {
    kind: "Perform",
    exp,
    meta,
  }
}

export type Branch = {
  kind: "Branch"
  condition: Exp
  consequence: Exp
  alternative: Exp
  meta?: Meta
}

export function Branch(
  condition: Exp,
  consequence: Exp,
  alternative: Exp,
  meta?: Meta,
): Branch {
  return {
    kind: "Branch",
    condition,
    consequence,
    alternative,
    meta,
  }
}

export type Goto = {
  kind: "Goto"
  exp: Exp
  meta?: Meta
}

export function Goto(exp: Exp, meta?: Meta): Goto {
  return {
    kind: "Goto",
    exp,
    meta,
  }
}

export type Return = {
  kind: "Return"
  exp: Exp
  meta?: Meta
}

export function Return(exp: Exp, meta?: Meta): Return {
  return {
    kind: "Return",
    exp,
    meta,
  }
}
