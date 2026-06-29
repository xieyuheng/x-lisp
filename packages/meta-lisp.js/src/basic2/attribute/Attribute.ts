import { type Type } from "../type/index.ts"

export type Attribute =
  TypeAttribute | SymbolAttribute | IntAttribute | ListAttribute

export type TypeAttribute = {
  kind: "TypeAttribute"
  value: Type
}

export function TypeAttribute(value: Type): TypeAttribute {
  return { kind: "TypeAttribute", value }
}

export type SymbolAttribute = {
  kind: "SymbolAttribute"
  value: string
}

export function SymbolAttribute(value: string): SymbolAttribute {
  return { kind: "SymbolAttribute", value }
}

export type IntAttribute = {
  kind: "IntAttribute"
  value: number
}

export function IntAttribute(value: number): IntAttribute {
  return { kind: "IntAttribute", value }
}

export type ListAttribute = {
  kind: "ListAttribute"
  elements: Array<Attribute>
}

export function ListAttribute(elements: Array<Attribute>): ListAttribute {
  return { kind: "ListAttribute", elements }
}
