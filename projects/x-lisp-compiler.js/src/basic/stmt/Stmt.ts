import { type TokenMeta } from "@xieyuheng/sexp-tael.js"
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
  meta?: TokenMeta
}

export function DefineFunction(
  mod: Mod,
  name: string,
  parameters: Array<string>,
  blocks: Map<string, Block>,
  meta?: TokenMeta,
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
  meta?: TokenMeta
}

export function DefineVariable(
  mod: Mod,
  name: string,
  blocks: Map<string, Block>,
  meta?: TokenMeta,
): DefineVariable {
  return {
    kind: "DefineVariable",
    mod,
    name,
    blocks,
    meta,
  }
}
