import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Exp } from "../exp/index.ts"
import type { Mod } from "../mod/index.ts"

export type Definition = FunctionDefinition | ConstantDefinition

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

export type ConstantDefinition = {
  kind: "ConstantDefinition"
  mod: Mod
  name: string
  body: Exp
  meta: Meta
}

export function ConstantDefinition(
  mod: Mod,
  name: string,
  body: Exp,
  meta: Meta,
): ConstantDefinition {
  return {
    kind: "ConstantDefinition",
    mod,
    name,
    body,
    meta,
  }
}
