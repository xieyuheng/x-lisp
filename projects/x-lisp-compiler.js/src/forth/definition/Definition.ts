import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Exp } from "../exp/index.ts"
import type { Mod } from "../mod/index.ts"

export type Definition = FunctionDefinition | VariableDefinition

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  mod: Mod
  name: string
  body: Exp
  meta: Meta
}

export function FunctionDefinition(
  mod: Mod,
  name: string,
  body: Exp,
  meta: Meta,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    mod,
    name,
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
  body: Exp  ,
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
