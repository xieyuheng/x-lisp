import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"

export type Operand =
  | Imm
  | LabelImm
  | Var
  | Reg
  | RegDeref
  | LabelDeref
  | Label
  | Cc
  | Arity

export type Imm = {
  kind: "Imm"
  value: bigint
  meta?: Meta
}

export function Imm(value: bigint, meta?: Meta): Imm {
  return {
    kind: "Imm",
    value,
    meta,
  }
}

export type LabelImm = {
  kind: "LabelImm"
  label: Label
  meta?: Meta
}

export function LabelImm(label: Label, meta?: Meta): LabelImm {
  return {
    kind: "LabelImm",
    label,
    meta,
  }
}

export type Var = {
  kind: "Var"
  name: string
  meta?: Meta
}

export function Var(name: string, meta?: Meta): Var {
  return {
    kind: "Var",
    name,
    meta,
  }
}

export type Reg = {
  kind: "Reg"
  name: string
  meta?: Meta
}

export function Reg(name: string, meta?: Meta): Reg {
  return {
    kind: "Reg",
    name,
    meta,
  }
}

export type RegDeref = {
  kind: "RegDeref"
  reg: Reg
  offset: number
  meta?: Meta
}

export function RegDeref(reg: Reg, offset: number, meta?: Meta): RegDeref {
  return {
    kind: "RegDeref",
    reg,
    offset,
    meta,
  }
}

export type LabelDeref = {
  kind: "LabelDeref"
  label: Label
  meta?: Meta
}

export function LabelDeref(label: Label, meta?: Meta): LabelDeref {
  return {
    kind: "LabelDeref",
    label,
    meta,
  }
}

export type Label = {
  kind: "Label"
  name: string
  attributes: { isExternal: boolean }
  meta?: Meta
}

export function Label(
  name: string,
  attributes: { isExternal: boolean },
  meta?: Meta,
): Label {
  return {
    kind: "Label",
    name,
    attributes,
    meta,
  }
}

export type ConditionCode = "e" | "l" | "le" | "g" | "ge"

export type Cc = {
  kind: "Cc"
  code: ConditionCode
  meta?: Meta
}

export function Cc(code: ConditionCode, meta?: Meta): Cc {
  return {
    kind: "Cc",
    code,
    meta,
  }
}

export type Arity = {
  kind: "Arity"
  value: number
  meta?: Meta
}

export function Arity(value: number, meta?: Meta): Arity {
  return {
    kind: "Arity",
    value,
    meta,
  }
}
