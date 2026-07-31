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
  content: Type
}

export function TypeAttribute(content: Type): TypeAttribute {
  return { kind: "TypeAttribute", content }
}

export type SymbolAttribute = {
  kind: "SymbolAttribute"
  content: string
}

export function SymbolAttribute(content: string): SymbolAttribute {
  return { kind: "SymbolAttribute", content }
}

export type IntAttribute = {
  kind: "IntAttribute"
  content: bigint
}

export function IntAttribute(content: bigint): IntAttribute {
  return { kind: "IntAttribute", content }
}

export type FloatAttribute = {
  kind: "FloatAttribute"
  content: number
}

export function FloatAttribute(content: number): FloatAttribute {
  return { kind: "FloatAttribute", content }
}

export type BoolAttribute = {
  kind: "BoolAttribute"
  content: boolean
}

export function BoolAttribute(content: boolean): BoolAttribute {
  return { kind: "BoolAttribute", content }
}

export type StringAttribute = {
  kind: "StringAttribute"
  content: string
}

export function StringAttribute(content: string): StringAttribute {
  return { kind: "StringAttribute", content }
}

export type ListAttribute = {
  kind: "ListAttribute"
  elements: Array<Attribute>
}

export function ListAttribute(elements: Array<Attribute>): ListAttribute {
  return { kind: "ListAttribute", elements }
}
