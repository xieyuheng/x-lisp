import { type SourceLocation } from "@xieyuheng/sexp.js"

export type Exp =
  | VarExp
  | IntExp
  | StringExp
  | StructExp
  | PointerExp
  | AddressExp

export type StructField = {
  name: string
  exp: Exp
}

export function StructField(name: string, exp: Exp): StructField {
  return {
    name,
    exp,
  }
}

export type VarExp = {
  kind: "VarExp"
  name: string
  location: SourceLocation
}

export function VarExp(name: string, location: SourceLocation): VarExp {
  return {
    kind: "VarExp",
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
  name: string | undefined
  fields: Array<StructField>
  location: SourceLocation
}

export function StructExp(
  name: string | undefined,
  fields: Array<StructField>,
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
