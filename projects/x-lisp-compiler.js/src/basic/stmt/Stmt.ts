import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import type { Label } from "../exp/index.ts"
import type { Instr } from "../instr/index.ts"
import type { Mod } from "../mod/index.ts"
import type { AboutModule } from "./AboutModule.ts"

export type Stmt = AboutModule | DefineFunction | DefineVariable

export type Line = Label | Instr

export type DefineFunction = {
  kind: "DefineFunction"
  mod: Mod
  name: string
  parameters: Array<string>
  lines: Array<Line>
  meta?: Meta
}

export function DefineFunction(
  mod: Mod,
  name: string,
  parameters: Array<string>,
  lines: Array<Line>,
  meta?: Meta,
): DefineFunction {
  return {
    kind: "DefineFunction",
    mod,
    name,
    parameters,
    lines,
    meta,
  }
}

export type DefineVariable = {
  kind: "DefineVariable"
  mod: Mod
  name: string
  lines: Array<Line>
  meta?: Meta
}

export function DefineVariable(
  mod: Mod,
  name: string,
  lines: Array<Line>,
  meta?: Meta,
): DefineVariable {
  return {
    kind: "DefineVariable",
    mod,
    name,
    lines,
    meta,
  }
}
