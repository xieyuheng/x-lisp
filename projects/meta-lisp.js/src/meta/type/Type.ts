import type { DataDefinition } from "../definition/index.ts"

export type Type =
  | VarType
  | CanonicalLabelType
  | TypeType
  | AtomType
  | ArrowType
  | ListType
  | SetType
  | HashType
  | DefinedDataType
  | PolymorphicType

// --- VarType ---

export type VarType = {
  kind: "VarType"
  name: string
  serialNumber: bigint
}

export function VarType(name: string, serialNumber: bigint): VarType {
  return { kind: "VarType", name, serialNumber }
}

export function isVarType(type: Type): type is VarType {
  return type.kind === "VarType"
}

export function asVarType(type: Type): VarType {
  if (isVarType(type)) return type
  throw new Error(`[asVarType] fail on: ${type.kind}`)
}

// --- CanonicalLabelType ---

export type CanonicalLabelType = {
  kind: "CanonicalLabelType"
  serialNumber: bigint
}

export function CanonicalLabelType(serialNumber: bigint): CanonicalLabelType {
  return { kind: "CanonicalLabelType", serialNumber }
}

export function isCanonicalLabelType(type: Type): type is CanonicalLabelType {
  return type.kind === "CanonicalLabelType"
}

export function asCanonicalLabelType(type: Type): CanonicalLabelType {
  if (isCanonicalLabelType(type)) return type
  throw new Error(`[asCanonicalLabelType] fail on: ${type.kind}`)
}

// --- TypeType ---

export type TypeType = {
  kind: "TypeType"
}

export function TypeType(): TypeType {
  return { kind: "TypeType" }
}

export function isTypeType(type: Type): type is TypeType {
  return type.kind === "TypeType"
}

export function asTypeType(type: Type): TypeType {
  if (isTypeType(type)) return type
  throw new Error(`[asTypeType] fail on: ${type.kind}`)
}

// --- AtomType ---

export type AtomType = {
  kind: "AtomType"
  name: string
}

export function AtomType(name: string): AtomType {
  return { kind: "AtomType", name }
}

export function isAtomType(type: Type): type is AtomType {
  return type.kind === "AtomType"
}

export function asAtomType(type: Type): AtomType {
  if (isAtomType(type)) return type
  throw new Error(`[asAtomType] fail on: ${type.kind}`)
}

// --- ArrowType ---

export type ArrowType = {
  kind: "ArrowType"
  argTypes: Array<Type>
  retType: Type
}

export function ArrowType(argTypes: Array<Type>, retType: Type): ArrowType {
  return { kind: "ArrowType", argTypes, retType }
}

export function isArrowType(type: Type): type is ArrowType {
  return type.kind === "ArrowType"
}

export function asArrowType(type: Type): ArrowType {
  if (isArrowType(type)) return type
  throw new Error(`[asArrowType] fail on: ${type.kind}`)
}

// --- ListType ---

export type ListType = {
  kind: "ListType"
  elementType: Type
}

export function ListType(elementType: Type): ListType {
  return { kind: "ListType", elementType }
}

export function isListType(type: Type): type is ListType {
  return type.kind === "ListType"
}

export function asListType(type: Type): ListType {
  if (isListType(type)) return type
  throw new Error(`[asListType] fail on: ${type.kind}`)
}

// --- SetType ---

export type SetType = {
  kind: "SetType"
  elementType: Type
}

export function SetType(elementType: Type): SetType {
  return { kind: "SetType", elementType }
}

export function isSetType(type: Type): type is SetType {
  return type.kind === "SetType"
}

export function asSetType(type: Type): SetType {
  if (isSetType(type)) return type
  throw new Error(`[asSetType] fail on: ${type.kind}`)
}

// --- HashType ---

export type HashType = {
  kind: "HashType"
  keyType: Type
  valueType: Type
}

export function HashType(keyType: Type, valueType: Type): HashType {
  return { kind: "HashType", keyType, valueType }
}

export function isHashType(type: Type): type is HashType {
  return type.kind === "HashType"
}

export function asHashType(type: Type): HashType {
  if (isHashType(type)) return type
  throw new Error(`[asHashType] fail on: ${type.kind}`)
}

// --- DefinedDataType ---

export type DefinedDataType = {
  kind: "DefinedDataType"
  definition: DataDefinition
  argTypes: Array<Type>
}

export function DefinedDataType(
  definition: DataDefinition,
  argTypes: Array<Type>,
): DefinedDataType {
  return { kind: "DefinedDataType", definition, argTypes }
}

export function isDefinedDataType(type: Type): type is DefinedDataType {
  return type.kind === "DefinedDataType"
}

export function asDefinedDataType(type: Type): DefinedDataType {
  if (isDefinedDataType(type)) return type
  throw new Error(`[asDefinedDataType] fail on: ${type.kind}`)
}

// --- PolymorphicType ---

export type PolymorphicType = {
  kind: "PolymorphicType"
  varTypes: Array<VarType>
  bodyType: Type
}

export function PolymorphicType(
  varTypes: Array<VarType>,
  bodyType: Type,
): PolymorphicType {
  return { kind: "PolymorphicType", varTypes, bodyType }
}

export function isPolymorphicType(type: Type): type is PolymorphicType {
  return type.kind === "PolymorphicType"
}

export function asPolymorphicType(type: Type): PolymorphicType {
  if (isPolymorphicType(type)) return type
  throw new Error(`[asPolymorphicType] fail on: ${type.kind}`)
}
