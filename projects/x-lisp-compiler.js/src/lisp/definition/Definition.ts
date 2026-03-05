import { type TokenMeta } from "@xieyuheng/sexp-tael.js"
import { type Exp } from "../exp/index.ts"
import type { Mod } from "../mod/index.ts"
import type { Value } from "../value/index.ts"

export type Definition =
  | PrimitiveFunctionDefinition
  | PrimitiveVariableDefinition
  | FunctionDefinition
  | VariableDefinition
  | TypeDefinition
  | DatatypeDefinition

export type ValueFunction = (...args: Array<Value>) => Value

export type PrimitiveFunctionDefinition = {
  kind: "PrimitiveFunctionDefinition"
  mod: Mod
  name: string
  arity: number
  fn: ValueFunction
  meta?: TokenMeta
}

export function PrimitiveFunctionDefinition(
  mod: Mod,
  name: string,
  arity: number,
  fn: ValueFunction,
  meta?: TokenMeta,
): PrimitiveFunctionDefinition {
  return {
    kind: "PrimitiveFunctionDefinition",
    mod,
    name,
    arity,
    fn,
    meta,
  }
}

export type PrimitiveVariableDefinition = {
  kind: "PrimitiveVariableDefinition"
  mod: Mod
  name: string
  value: Value
  meta?: TokenMeta
}

export function PrimitiveVariableDefinition(
  mod: Mod,
  name: string,
  value: Value,
  meta?: TokenMeta,
): PrimitiveVariableDefinition {
  return {
    kind: "PrimitiveVariableDefinition",
    mod,
    name,
    value,
    meta,
  }
}

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  mod: Mod
  name: string
  parameters: Array<string>
  body: Exp
  meta?: TokenMeta
}

export function FunctionDefinition(
  mod: Mod,
  name: string,
  parameters: Array<string>,
  body: Exp,
  meta?: TokenMeta,
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
  value?: Value
  meta?: TokenMeta
}

export function VariableDefinition(
  mod: Mod,
  name: string,
  body: Exp,
  meta?: TokenMeta,
): VariableDefinition {
  return {
    kind: "VariableDefinition",
    mod,
    name,
    body,
    meta,
  }
}

export type TypeDefinition = {
  kind: "TypeDefinition"
  mod: Mod
  name: string
  body: Exp
  value?: Value
  meta?: TokenMeta
}

export function TypeDefinition(
  mod: Mod,
  name: string,
  body: Exp,
  meta?: TokenMeta,
): TypeDefinition {
  return {
    kind: "TypeDefinition",
    mod,
    name,
    body,
    meta,
  }
}

export type DatatypeDefinition = {
  kind: "DatatypeDefinition"
  mod: Mod
  name: string
  datatypeConstructor: DatatypeConstructorSpec
  dataConstructors: Array<DataConstructorSpec>
  meta?: TokenMeta
}

export type DatatypeConstructorSpec = {
  name: string
  parameters: Array<string>
}

export type DataConstructorSpec = {
  name: string
  fields: Array<DataField>
}

export type DataField = {
  name: string
  type: Exp
}

export function DatatypeDefinition(
  mod: Mod,
  name: string,
  datatypeConstructor: DatatypeConstructorSpec,
  dataConstructors: Array<DataConstructorSpec>,
  meta?: TokenMeta,
): DatatypeDefinition {
  return {
    kind: "DatatypeDefinition",
    mod,
    name,
    datatypeConstructor,
    dataConstructors,
    meta,
  }
}
