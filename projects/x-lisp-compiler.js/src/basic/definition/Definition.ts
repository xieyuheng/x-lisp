import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import type { Label } from "../exp/index.ts"
import type { Instr } from "../instr/index.ts"
import type { Mod } from "../mod/index.ts"

export type Definition = FunctionDefinition

export type Line = Label | Instr

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  mod: Mod
  name: string
  lines: Array<Line>
  meta?: Meta
}

export function FunctionDefinition(
  mod: Mod,
  name: string,
  lines: Array<Line>,
  meta?: Meta,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    mod,
    name,
    lines,
    meta,
  }
}
