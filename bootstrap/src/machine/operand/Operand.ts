import { type TokenMeta as Meta } from "@xieyuheng/x-sexp.js"

export type Operand = Imm | Var | Reg | Mem | Label

export type Imm = { kind: "Imm"; value: number; meta?: Meta }
export const Imm = (value: number, meta?: Meta): Imm => ({
  kind: "Imm",
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

export type Mem = {
  kind: "Mem"
  regName: string
  offset: number
  meta?: Meta
}
export const Mem = (regName: string, offset: number, meta?: Meta): Mem => ({
  kind: "Mem",
  regName,
  offset,
  meta,
})

export type Label = { kind: "Label"; name: string; meta?: Meta }
export const Label = (name: string, meta?: Meta): Label => ({
  kind: "Label",
  name,
  meta,
})
