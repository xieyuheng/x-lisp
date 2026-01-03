import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import type { Mod } from "../mod/index.ts"

export type Definition = FunctionDefinition | VariableDefinition

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  mod: Mod
  name: string
  meta: Meta
}

export function FunctionDefinition(
  mod: Mod,
  name: string,
  meta: Meta,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    mod,
    name,
    meta,
  }
}

export type VariableDefinition = {
  kind: "VariableDefinition"
  mod: Mod
  name: string
  meta: Meta
}

export function VariableDefinition(
  mod: Mod,
  name: string,
  meta: Meta,
): VariableDefinition {
  return {
    kind: "VariableDefinition",
    mod,
    name,
    meta,
  }
}
