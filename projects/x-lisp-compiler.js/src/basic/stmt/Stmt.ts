import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Block } from "../block/index.ts"
import type { Mod } from "../mod/index.ts"
import type { AboutModule } from "./AboutModule.ts"

export type Stmt = AboutModule | DefineFunction | DefineVariable

export type DefineFunction = {
  kind: "DefineFunction"
  mod: Mod
  name: string
  parameters: Array<string>
  blocks: Map<string, Block>
  meta?: Meta
}

export function DefineFunction(
  mod: Mod,
  name: string,
  parameters: Array<string>,
  blocks: Map<string, Block>,
  meta?: Meta,
): DefineFunction {
  return {
    kind: "DefineFunction",
    mod,
    name,
    parameters,
    blocks,
    meta,
  }
}

export type DefineVariable = {
  kind: "DefineVariable"
  mod: Mod
  name: string
  blocks: Map<string, Block>
  meta?: Meta
}

export function DefineVariable(
  mod: Mod,
  name: string,
  blocks: Map<string, Block>,
  meta?: Meta,
): DefineVariable {
  return {
    kind: "DefineVariable",
    mod,
    name,
    blocks,
    meta,
  }
}
