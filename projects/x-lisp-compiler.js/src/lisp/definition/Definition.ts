import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Exp } from "../exp/index.ts"
import type { Mod } from "../mod/index.ts"

export type Definition =
  | PrimitiveFunctionDefinition
  | PrimitiveVariableDefinition
  | FunctionDefinition
  | VariableDefinition
  | DatatypeDefinition

export type PrimitiveFunctionDefinition = {
  kind: "PrimitiveFunctionDefinition"
  mod: Mod
  name: string
  arity: number
  meta?: Meta
}

export function PrimitiveFunctionDefinition(
  mod: Mod,
  name: string,
  arity: number,
  meta?: Meta,
): PrimitiveFunctionDefinition {
  return {
    kind: "PrimitiveFunctionDefinition",
    mod,
    name,
    arity,
    meta,
  }
}

export type PrimitiveVariableDefinition = {
  kind: "PrimitiveVariableDefinition"
  mod: Mod
  name: string
  meta?: Meta
}

export function PrimitiveVariableDefinition(
  mod: Mod,
  name: string,
  meta?: Meta,
): PrimitiveVariableDefinition {
  return {
    kind: "PrimitiveVariableDefinition",
    mod,
    name,
    meta,
  }
}

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  mod: Mod
  name: string
  parameters: Array<string>
  body: Exp
  meta?: Meta
}

export function FunctionDefinition(
  mod: Mod,
  name: string,
  parameters: Array<string>,
  body: Exp,
  meta?: Meta,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    mod,
    name,
    parameters,
    body,
    meta,
  }
}

export type VariableDefinition = {
  kind: "VariableDefinition"
  mod: Mod
  name: string
  body: Exp
  meta?: Meta
}

export function VariableDefinition(
  mod: Mod,
  name: string,
  body: Exp,
  meta?: Meta,
): VariableDefinition {
  return {
    kind: "VariableDefinition",
    mod,
    name,
    body,
    meta,
  }
}

export type DatatypeSpec = {
  name: string
  parameters: Array<string>
}

export type DataField = {
  name: string
  schema: Exp
}

export type DataConstructorSpec = {
  name: string
  fields: Array<DataField>
}

export type DatatypeDefinition = {
  kind: "DatatypeDefinition"
  mod: Mod
  name: string
  type: DatatypeSpec
  constructors: Array<DataConstructorSpec>
  meta?: Meta
}

export function DatatypeDefinition(
  mod: Mod,
  name: string,
  type: DatatypeSpec,
  constructors: Array<DataConstructorSpec>,
  meta?: Meta,
): DatatypeDefinition {
  return {
    kind: "DatatypeDefinition",
    mod,
    name,
    type,
    constructors,
    meta,
  }
}
