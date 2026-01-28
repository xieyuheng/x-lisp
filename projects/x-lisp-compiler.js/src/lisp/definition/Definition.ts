import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Exp } from "../exp/index.ts"
import type { Mod } from "../mod/index.ts"

export type Definition =
  | PrimitiveFunctionDefinition
  | PrimitiveVariableDefinition
  | FunctionDefinition
  | VariableDefinition

export type PrimitiveFunctionDefinition = {
  kind: "PrimitiveFunctionDefinition"
  mod: Mod
  name: string
  arity: number
}

export function PrimitiveFunctionDefinition(
  mod: Mod,
  name: string,
  arity: number,
): PrimitiveFunctionDefinition {
  return {
    kind: "PrimitiveFunctionDefinition",
    mod,
    name,
    arity,
  }
}

export type PrimitiveVariableDefinition = {
  kind: "PrimitiveVariableDefinition"
  mod: Mod
  name: string
}

export function PrimitiveVariableDefinition(
  mod: Mod,
  name: string,
): PrimitiveVariableDefinition {
  return {
    kind: "PrimitiveVariableDefinition",
    mod,
    name,
  }
}

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  mod: Mod
  name: string
  parameters: Array<string>
  body: Exp
  meta: Meta
}

export function FunctionDefinition(
  mod: Mod,
  name: string,
  parameters: Array<string>,
  body: Exp,
  meta: Meta,
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
  meta: Meta
}

export function VariableDefinition(
  mod: Mod,
  name: string,
  body: Exp,
  meta: Meta,
): VariableDefinition {
  return {
    kind: "VariableDefinition",
    mod,
    name,
    body,
    meta,
  }
}
