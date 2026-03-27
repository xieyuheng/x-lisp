import { type SourceLocation } from "@xieyuheng/sexp.js"
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
  meta?: SourceLocation
}

export function DefineFunction(
  mod: Mod,
  name: string,
  parameters: Array<string>,
  blocks: Map<string, Block>,
  meta?: SourceLocation,
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
  meta?: SourceLocation
}

export function DefineVariable(
  mod: Mod,
  name: string,
  blocks: Map<string, Block>,
  meta?: SourceLocation,
): DefineVariable {
  return {
    kind: "DefineVariable",
    mod,
    name,
    blocks,
    meta,
  }
}
