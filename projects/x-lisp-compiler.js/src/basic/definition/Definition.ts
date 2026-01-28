import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import type { Mod } from "../mod/index.ts"

export type Definition = FunctionDefinition

// export type Line = Label | Instr

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  mod: Mod
  name: string
  meta?: Meta
}

export function FunctionDefinition(
  mod: Mod,
  name: string,
  meta?: Meta,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    mod,
    name,
    meta,
  }
}
