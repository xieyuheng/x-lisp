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
  entryBlock: Block
  blocks: Map<string, Block>
  meta?: Meta
}

export function DefineFunction(
  mod: Mod,
  name: string,
  parameters: Array<string>,
  entryBlock: Block,
  blocks: Map<string, Block>,
  meta?: Meta,
): DefineFunction {
  return {
    kind: "DefineFunction",
    mod,
    name,
    parameters,
    entryBlock,
    blocks,
    meta,
  }
}

export type DefineVariable = {
  kind: "DefineVariable"
  mod: Mod
  name: string
  entryBlock: Block
  blocks: Map<string, Block>
  meta?: Meta
}

export function DefineVariable(
  mod: Mod,
  name: string,
  entryBlock: Block,
  blocks: Map<string, Block>,
  meta?: Meta,
): DefineVariable {
  return {
    kind: "DefineVariable",
    mod,
    name,
    entryBlock,
    blocks,
    meta,
  }
}
