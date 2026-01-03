import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Exp } from "../exp/index.ts"
import type { Mod } from "../mod/index.ts"

export type Stmt = DefineFunction | DefineVariable

export type DefineFunction = {
  kind: "DefineFunction"
  mod: Mod
  name: string
  body: Exp
  meta: Meta
}

export function DefineFunction(
  mod: Mod,
  name: string,
  body: Exp,
  meta: Meta,
): DefineFunction {
  return {
    kind: "DefineFunction",
    mod,
    name,
    body,
    meta,
  }
}

export type DefineVariable = {
  kind: "DefineVariable"
  mod: Mod
  name: string
  body: Exp
  meta: Meta
}

export function DefineVariable(
  mod: Mod,
  name: string,
  body: Exp,
  meta: Meta,
): DefineVariable {
  return {
    kind: "DefineVariable",
    mod,
    name,
    body,
    meta,
  }
}
