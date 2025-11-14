import { type TokenMeta as Meta } from "@xieyuheng/x-sexp.js"

export type Operand =
  | Imm
  | ImmLabel
  | Var
  | Reg
  | Deref
  | DerefLabel
  | Label
  | Cc
  | Arity

export type Imm = { kind: "Imm"; value: number; meta?: Meta }
export const Imm = (value: number, meta?: Meta): Imm => ({
  kind: "Imm",
  value,
  meta,
})

export type ImmLabel = { kind: "ImmLabel"; value: string; meta?: Meta }
export const ImmLabel = (value: string, meta?: Meta): ImmLabel => ({
  kind: "ImmLabel",
  value,
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

export type Deref = {
  kind: "Deref"
  regName: string
  offset: number
  meta?: Meta
}
export const Deref = (regName: string, offset: number, meta?: Meta): Deref => ({
  kind: "Deref",
  regName,
  offset,
  meta,
})

export type DerefLabel = {
  kind: "DerefLabel"
  label: string
  meta?: Meta
}
export const DerefLabel = (label: string, meta?: Meta): DerefLabel => ({
  kind: "DerefLabel",
  label,
  meta,
})

export type Label = { kind: "Label"; name: string; meta?: Meta }
export const Label = (name: string, meta?: Meta): Label => ({
  kind: "Label",
  name,
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
