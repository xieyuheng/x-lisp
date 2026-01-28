import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import type { Mod } from "../mod/index.ts"
import type { Instr } from "../instr/index.ts"

export type Definition = FunctionDefinition

export type Label = {
  kind: "Label"
  name: string
}

export function Label(name: string): Label {
  return {
    kind: "Label",
    name,
  }
}

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
