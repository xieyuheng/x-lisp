import type { Type } from "./Type.ts"

export type Exp = LittleEndian | BigEndian | Sequence | Attribute | Dependent

export type LittleEndian = { kind: "LittleEndian"; exp: Exp }
export const LittleEndian = (exp: Exp) => ({ kind: "LittleEndian", exp })

export type BigEndian = { kind: "BigEndian"; exp: Exp }
export const BigEndian = (exp: Exp) => ({ kind: "BigEndian", exp })

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

export type Dependent = { kind: "Dependent"; fn: (data: any) => Exp }
export const Dependent = (fn: (data: any) => Exp): Dependent => ({
  kind: "Dependent",
  fn,
})
