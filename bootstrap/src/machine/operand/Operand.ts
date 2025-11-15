import { type TokenMeta as Meta } from "@xieyuheng/x-sexp.js"

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

export type Imm = { kind: "Imm"; value: number; meta?: Meta }
export const Imm = (value: number, meta?: Meta): Imm => ({
  kind: "Imm",
  value,
  meta,
})

export type LabelImm = { kind: "LabelImm"; label: Label; meta?: Meta }
export const LabelImm = (label: Label, meta?: Meta): LabelImm => ({
  kind: "LabelImm",
  label,
  meta,
})

export type Var = { kind: "Var"; name: string; meta?: Meta }
export const Var = (name: string, meta?: Meta): Var => ({
  kind: "Var",
  name,
  meta,
})

export type Reg = { kind: "Reg"; name: string; meta?: Meta }
export const Reg = (name: string, meta?: Meta): Reg => ({
  kind: "Reg",
  name,
  meta,
})

export type RegDeref = {
  kind: "RegDeref"
  reg: Reg
  offset: number
  meta?: Meta
}
export const RegDeref = (reg: Reg, offset: number, meta?: Meta): RegDeref => ({
  kind: "RegDeref",
  reg,
  offset,
  meta,
})

export type LabelDeref = {
  kind: "LabelDeref"
  label: Label
  meta?: Meta
}
export const LabelDeref = (label: Label, meta?: Meta): LabelDeref => ({
  kind: "LabelDeref",
  label,
  meta,
})

export type Label = {
  kind: "Label"
  name: string
  attributes: { isExternal: boolean }
  meta?: Meta
}
export const Label = (
  name: string,
  attributes: { isExternal: boolean },
  meta?: Meta,
): Label => ({
  kind: "Label",
  name,
  attributes,
  meta,
})

export type ConditionCode = "e" | "l" | "le" | "g" | "ge"

export type Cc = { kind: "Cc"; code: ConditionCode; meta?: Meta }
export const Cc = (code: ConditionCode, meta?: Meta): Cc => ({
  kind: "Cc",
  code,
  meta,
})

export type Arity = { kind: "Arity"; value: number; meta?: Meta }
export const Arity = (value: number, meta?: Meta): Arity => ({
  kind: "Arity",
  value,
  meta,
})
