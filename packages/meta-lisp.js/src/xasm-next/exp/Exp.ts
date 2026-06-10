import { type SourceLocation } from "@xieyuheng/sexp.js"

export type Exp =
  | VarExp
  | IntExp
  | StringExp
  | ApplyExp
  | StructExp
  | PointerExp
  | LabelExp

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

export type ApplyExp = {
  kind: "ApplyExp"
  target: Exp
  args: Array<Exp>
  location: SourceLocation
}

export function ApplyExp(
  target: Exp,
  args: Array<Exp>,
  location: SourceLocation,
): ApplyExp {
  return {
    kind: "ApplyExp",
    target,
    args,
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

export function PointerExp(
  target: Exp,
  location: SourceLocation,
): PointerExp {
  return {
    kind: "PointerExp",
    target,
    location,
  }
}

export type LabelExp = {
  kind: "LabelExp"
  name: string
  path: Array<string>
  location: SourceLocation
}

export function LabelExp(
  name: string,
  path: Array<string>,
  location: SourceLocation,
): LabelExp {
  return {
    kind: "LabelExp",
    name,
    path,
    location,
  }
}
