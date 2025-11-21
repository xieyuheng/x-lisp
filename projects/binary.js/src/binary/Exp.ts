import type { Data } from "./State.ts"
import type { Type } from "./Type.ts"

export type Exp =
  | LittleEndian
  | BigEndian
  | Sequence
  | Attribute
  | Dependent
  | Magic
  | Padding
  | Offset

export type LittleEndian = { kind: "LittleEndian"; exp: Exp }
export const LittleEndian = (exp: Exp): LittleEndian => ({
  kind: "LittleEndian",
  exp,
})

export type BigEndian = { kind: "BigEndian"; exp: Exp }
export const BigEndian = (exp: Exp): BigEndian => ({ kind: "BigEndian", exp })

export type Sequence = { kind: "Sequence"; exps: Array<Exp> }
export const Sequence = (exps: Array<Exp>): Sequence => ({
  kind: "Sequence",
  exps,
})

export type Attribute = { kind: "Attribute"; name: string; type: Type }
export const Attribute = (name: string, type: Type): Attribute => ({
  kind: "Attribute",
  name,
  type,
})

export type Dependent = { kind: "Dependent"; fn: (data: Data) => Exp }
export const Dependent = (fn: (data: Data) => Exp): Dependent => ({
  kind: "Dependent",
  fn,
})

export type Magic = { kind: "Magic"; byte: number }
export const Magic = (byte: number): Magic => ({
  kind: "Magic",
  byte,
})

export type Padding = { kind: "Padding"; value: number }
export const Padding = (value: number): Padding => ({
  kind: "Padding",
  value,
})

export type Offset = { kind: "Offset"; value: number; exp: Exp }
export const Offset = (value: number, exp: Exp): Offset => ({
  kind: "Offset",
  value,
  exp,
})
