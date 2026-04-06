import { type SourceLocation } from "@xieyuheng/sexp.js"
import { type Block } from "../block/index.ts"
import type { Mod } from "../mod/index.ts"
import type { AboutImport } from "./AboutImport.ts"

export type Stmt = AboutImport | DefineFunction | DefineVariable

export type DefineFunction = {
  kind: "DefineFunction"
  mod: Mod
  name: string
  parameters: Array<string>
  blocks: Map<string, Block>
  location?: SourceLocation
}

export function DefineFunction(
  mod: Mod,
  name: string,
  parameters: Array<string>,
  blocks: Map<string, Block>,
  location?: SourceLocation,
): DefineFunction {
  return {
    kind: "DefineFunction",
    mod,
    name,
    parameters,
    blocks,
    location,
  }
}

export type DefineVariable = {
  kind: "DefineVariable"
  mod: Mod
  name: string
  blocks: Map<string, Block>
  location?: SourceLocation
}

export function DefineVariable(
  mod: Mod,
  name: string,
  blocks: Map<string, Block>,
  location?: SourceLocation,
): DefineVariable {
  return {
    kind: "DefineVariable",
    mod,
    name,
    blocks,
    location,
  }
}
