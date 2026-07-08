import { type Type } from "../type/index.ts"

export type Attribute =
  | TypeAttribute
  | SymbolAttribute
  | IntAttribute
  | FloatAttribute
  | BoolAttribute
  | StringAttribute
  | ListAttribute

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
  value: bigint
}

export function IntAttribute(value: bigint): IntAttribute {
  return { kind: "IntAttribute", value }
}

export type FloatAttribute = {
  kind: "FloatAttribute"
  value: number
}

export function FloatAttribute(value: number): FloatAttribute {
  return { kind: "FloatAttribute", value }
}

export type BoolAttribute = {
  kind: "BoolAttribute"
  value: boolean
}

export function BoolAttribute(value: boolean): BoolAttribute {
  return { kind: "BoolAttribute", value }
}

export type StringAttribute = {
  kind: "StringAttribute"
  value: string
}

export function StringAttribute(value: string): StringAttribute {
  return { kind: "StringAttribute", value }
}

export type ListAttribute = {
  kind: "ListAttribute"
  elements: Array<Attribute>
}

export function ListAttribute(elements: Array<Attribute>): ListAttribute {
  return { kind: "ListAttribute", elements }
}
