export type Exp =
  | AddressExp
  | IntExp
  | FloatExp
  | StringExp
  | StructExp
  | PointerExp
  | ArrayExp

export type AddressExp = {
  kind: "AddressExp"
  name: string
}

export function AddressExp(name: string): AddressExp {
  return { kind: "AddressExp", name }
}

export type IntExp = {
  kind: "IntExp"
  value: bigint
}

export function IntExp(value: bigint): IntExp {
  return { kind: "IntExp", value }
}

export type FloatExp = {
  kind: "FloatExp"
  value: number
}

export function FloatExp(value: number): FloatExp {
  return { kind: "FloatExp", value }
}

export type StringExp = {
  kind: "StringExp"
  content: string
}

export function StringExp(content: string): StringExp {
  return { kind: "StringExp", content }
}

export type StructExp = {
  kind: "StructExp"
  name: string
  fields: Record<string, Exp>
}

export function StructExp(
  name: string,
  fields: Record<string, Exp>,
): StructExp {
  return { kind: "StructExp", name, fields }
}

export type PointerExp = {
  kind: "PointerExp"
  target: Exp
}

export function PointerExp(target: Exp): PointerExp {
  return { kind: "PointerExp", target }
}

export type ArrayExp = {
  kind: "ArrayExp"
  elements: Exp[]
}

export function ArrayExp(elements: Exp[]): ArrayExp {
  return { kind: "ArrayExp", elements }
}
