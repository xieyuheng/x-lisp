export type Type =
  | Int64Type
  | Float64Type
  | BoolType
  | VoidType
  | PointerType
  | ValueType
  | NamedType
  | StructType
  | ArrowType

export type Int64Type = {
  kind: "Int64Type"
}

export function Int64Type(): Int64Type {
  return { kind: "Int64Type" }
}

export type Float64Type = {
  kind: "Float64Type"
}

export function Float64Type(): Float64Type {
  return { kind: "Float64Type" }
}

export type BoolType = {
  kind: "BoolType"
}

export function BoolType(): BoolType {
  return { kind: "BoolType" }
}

export type VoidType = {
  kind: "VoidType"
}

export function VoidType(): VoidType {
  return { kind: "VoidType" }
}

export type PointerType = {
  kind: "PointerType"
}

export function PointerType(): PointerType {
  return { kind: "PointerType" }
}

export type ValueType = {
  kind: "ValueType"
}

export function ValueType(): ValueType {
  return { kind: "ValueType" }
}

export type NamedType = {
  kind: "NamedType"
  name: string
}

export function NamedType(name: string): NamedType {
  return { kind: "NamedType", name }
}

export type StructType = {
  kind: "StructType"
  fields: Record<string, Type>
}

export function StructType(fields: Record<string, Type>): StructType {
  return { kind: "StructType", fields }
}

export type ArrowType = {
  kind: "ArrowType"
  argTypes: Array<Type>
  retType: Type
}

export function ArrowType(
  argTypes: Array<Type>,
  retType: Type,
): ArrowType {
  return { kind: "ArrowType", argTypes, retType }
}
