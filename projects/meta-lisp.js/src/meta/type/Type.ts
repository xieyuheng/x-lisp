import { range } from "@xieyuheng/helpers.js/range"
import type {
  AlgebraicTypeDefinition,
  Definition,
} from "../definition/index.ts"

export type Type =
  | VarType
  | CanonicalLabelType
  | TypeType
  | AtomType
  | ArrowType
  | ListType
  | SetType
  | HashType
  | AlgebraicType
  | PolymorphicType
  | CurryType
  | DefinitionType

// VarType

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

// CanonicalLabelType

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

// TypeType

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

// AtomType

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

// ArrowType

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

// ListType

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

// SetType

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

// HashType

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

// AlgebraicType

export type AlgebraicType = {
  kind: "AlgebraicType"
  definition: AlgebraicTypeDefinition
  argTypes: Array<Type>
}

export function AlgebraicType(
  definition: AlgebraicTypeDefinition,
  argTypes: Array<Type>,
): AlgebraicType {
  return { kind: "AlgebraicType", definition, argTypes }
}

export function isAlgebraicType(type: Type): type is AlgebraicType {
  return type.kind === "AlgebraicType"
}

export function asAlgebraicType(type: Type): AlgebraicType {
  if (isAlgebraicType(type)) return type
  throw new Error(`[asAlgebraicType] fail on: ${type.kind}`)
}

// PolymorphicType

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

// CurryType

export type CurryType = {
  kind: "CurryType"
  target: Type
  arity: number
  args: Array<Type>
}

export function CurryType(
  target: Type,
  arity: number,
  args: Array<Type>,
): CurryType {
  return { kind: "CurryType", target, arity, args }
}

export function isCurryType(type: Type): type is CurryType {
  return type.kind === "CurryType"
}

export function asCurryType(type: Type): CurryType {
  if (isCurryType(type)) return type
  throw new Error(`[asCurryType] fail on: ${type.kind}`)
}

// DefinitionType

export type DefinitionType = {
  kind: "DefinitionType"
  definition: Definition
}

export function DefinitionType(definition: Definition): DefinitionType {
  return { kind: "DefinitionType", definition }
}

export function isDefinitionType(type: Type): type is DefinitionType {
  return type.kind === "DefinitionType"
}

export function asDefinitionType(type: Type): DefinitionType {
  if (isDefinitionType(type)) return type
  throw new Error(`[asDefinitionType] fail on: ${type.kind}`)
}

// Helpers

export function varTypeId(type: VarType): string {
  return `${type.name}.${type.serialNumber}`
}

export function varTypeEqual(x: Type, y: Type): boolean {
  return (
    x.kind === "VarType" &&
    y.kind === "VarType" &&
    x.name === y.name &&
    x.serialNumber === y.serialNumber
  )
}

const serialNumberMap: Map<string, bigint> = new Map()

function generateVarTypeSerialNumber(name: string): bigint {
  const count = serialNumberMap.get(name)
  if (count) {
    serialNumberMap.set(name, count + 1n)
    return count + 1n
  } else {
    serialNumberMap.set(name, 1n)
    return 1n
  }
}

export function createFreshVarType(name: string): VarType {
  return VarType(name, generateVarTypeSerialNumber(name))
}

export function arrowTypeCurrying(type: Type): Type {
  if (type.kind !== "ArrowType") return type

  const argTypes = type.argTypes
  const retType = type.retType

  if (retType.kind !== "ArrowType") {
    if (argTypes.length <= 1) return type
    const [firstArgType, ...restArgTypes] = argTypes
    return ArrowType([firstArgType], ArrowType(restArgTypes, retType))
  }

  if (argTypes.length === 0) {
    return ArrowType(argTypes, arrowTypeCurrying(retType))
  }

  if (argTypes.length === 1) {
    return ArrowType(argTypes, arrowTypeCurrying(retType))
  }

  const [firstArgType, ...restArgTypes] = argTypes
  return ArrowType(
    [firstArgType],
    arrowTypeCurrying(ArrowType(restArgTypes, retType)),
  )
}

export function arrowTypeUncurrying(type: Type): Type {
  if (type.kind !== "ArrowType") return type

  const argTypes = type.argTypes
  const retType = type.retType

  if (retType.kind !== "ArrowType") return type

  const retTypeArgTypes = retType.argTypes
  const retTypeRetType = retType.retType

  if (argTypes.length === 0) {
    return ArrowType(argTypes, arrowTypeUncurrying(retType))
  }

  return ArrowType(
    [...argTypes, ...retTypeArgTypes],
    arrowTypeUncurrying(retTypeRetType),
  )
}

export function polymorphicTypeFreshSelf(
  type: PolymorphicType,
): PolymorphicType {
  const varTypes = type.varTypes
  const bodyType = type.bodyType
  const newVarTypes = varTypes.map((vt) => createFreshVarType(vt.name))
  const substMap = new Map<VarType, VarType>()
  for (const i of range(varTypes.length)) {
    substMap.set(varTypes[i], newVarTypes[i])
  }
  const newBodyType = replaceVarTypesInType(bodyType, substMap)
  return PolymorphicType(newVarTypes, newBodyType)
}

export function polymorphicTypeFreshBodyType(type: PolymorphicType): Type {
  const freshened = polymorphicTypeFreshSelf(type)
  return freshened.bodyType
}

export function polymorphicTypePrettifyVarTypes(
  type: PolymorphicType,
): PolymorphicType {
  const varTypes = type.varTypes
  const bodyType = type.bodyType
  const newVarTypes = range(varTypes.length).map((i) =>
    VarType(generatePrettyTypeVariableName(i), BigInt(0)),
  )
  const substMap = new Map<VarType, VarType>()
  for (const i of range(varTypes.length)) {
    substMap.set(varTypes[i], newVarTypes[i])
  }
  const newBodyType = replaceVarTypesInType(bodyType, substMap)
  return PolymorphicType(newVarTypes, newBodyType)
}

function replaceVarTypesInType(type: Type, subst: Map<VarType, VarType>): Type {
  if (type.kind === "VarType") {
    const found = subst.get(type)
    if (found) return found
    return type
  }

  if (type.kind === "ArrowType") {
    return ArrowType(
      type.argTypes.map((t) => replaceVarTypesInType(t, subst)),
      replaceVarTypesInType(type.retType, subst),
    )
  }

  if (type.kind === "ListType") {
    return ListType(replaceVarTypesInType(type.elementType, subst))
  }

  if (type.kind === "SetType") {
    return SetType(replaceVarTypesInType(type.elementType, subst))
  }

  if (type.kind === "HashType") {
    return HashType(
      replaceVarTypesInType(type.keyType, subst),
      replaceVarTypesInType(type.valueType, subst),
    )
  }

  if (type.kind === "AlgebraicType") {
    return AlgebraicType(
      type.definition,
      type.argTypes.map((t) => replaceVarTypesInType(t, subst)),
    )
  }

  if (type.kind === "PolymorphicType") {
    const newVarTypes = type.varTypes.map((vt) => {
      const found = subst.get(vt)
      return found || vt
    })
    const innerIds = new Set(type.varTypes.map((vt) => varTypeId(vt)))
    const filteredSubst = new Map<VarType, VarType>()
    for (const [k, v] of subst) {
      if (!innerIds.has(varTypeId(k))) {
        filteredSubst.set(k, v)
      }
    }
    return PolymorphicType(
      newVarTypes,
      replaceVarTypesInType(type.bodyType, filteredSubst),
    )
  }

  return type
}

const prettyTypeVariableNames = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
]

export function generatePrettyTypeVariableName(n: number): string {
  const found = prettyTypeVariableNames[n]
  if (found) {
    return found
  } else {
    return `T${n}`
  }
}
