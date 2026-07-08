export type Data =
  | AddressData
  | IntData
  | FloatData
  | StringData
  | StructData
  | PointerData
  | ArrayData

export type AddressData = {
  kind: "AddressData"
  name: string
}

export function AddressData(name: string): AddressData {
  return { kind: "AddressData", name }
}

export type IntData = {
  kind: "IntData"
  content: bigint
}

export function IntData(content: bigint): IntData {
  return { kind: "IntData", content }
}

export type FloatData = {
  kind: "FloatData"
  content: number
}

export function FloatData(content: number): FloatData {
  return { kind: "FloatData", content }
}

export type StringData = {
  kind: "StringData"
  content: string
}

export function StringData(content: string): StringData {
  return { kind: "StringData", content }
}

export type StructData = {
  kind: "StructData"
  name: string
  fields: Record<string, Data>
}

export function StructData(
  name: string,
  fields: Record<string, Data>,
): StructData {
  return { kind: "StructData", name, fields }
}

export type PointerData = {
  kind: "PointerData"
  target: Data
}

export function PointerData(target: Data): PointerData {
  return { kind: "PointerData", target }
}

export type ArrayData = {
  kind: "ArrayData"
  elements: Data[]
}

export function ArrayData(elements: Data[]): ArrayData {
  return { kind: "ArrayData", elements }
}
