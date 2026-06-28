import { type SourceLocation } from "@xieyuheng/sexp.js"

export type Exp =
  | AddressExp
  | IntExp
  | StringExp
  | StructExp
  | PointerExp
  | ArrayExp

export type AddressExp = {
  kind: "AddressExp"
  name: string
  location: SourceLocation
}

export function AddressExp(name: string, location: SourceLocation): AddressExp {
  return {
    kind: "AddressExp",
    name,
    location,
  }
}

export type IntExp = {
  kind: "IntExp"
  value: bigint
  location: SourceLocation
}

export function IntExp(value: bigint, location: SourceLocation): IntExp {
  return {
    kind: "IntExp",
    value,
    location,
  }
}

export type StringExp = {
  kind: "StringExp"
  content: string
  location: SourceLocation
}

export function StringExp(
  content: string,
  location: SourceLocation,
): StringExp {
  return {
    kind: "StringExp",
    content,
    location,
  }
}

export type StructExp = {
  kind: "StructExp"
  name: string
  fields: Record<string, Exp>
  location: SourceLocation
}

export function StructExp(
  name: string,
  fields: Record<string, Exp>,
  location: SourceLocation,
): StructExp {
  return {
    kind: "StructExp",
    name,
    fields,
    location,
  }
}

export type PointerExp = {
  kind: "PointerExp"
  target: Exp
  location: SourceLocation
}

export function PointerExp(target: Exp, location: SourceLocation): PointerExp {
  return {
    kind: "PointerExp",
    target,
    location,
  }
}

export type ArrayExp = {
  kind: "ArrayExp"
  elements: Array<Exp>
  location: SourceLocation
}

export function ArrayExp(
  elements: Array<Exp>,
  location: SourceLocation,
): ArrayExp {
  return {
    kind: "ArrayExp",
    elements,
    location,
  }
}
