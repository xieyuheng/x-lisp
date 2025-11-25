import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Block } from "../block/index.ts"
import type { AboutModule } from "./AboutModule.ts"
import type { Value } from "../value/index.ts"

export type Stmt = AboutModule | DefineFunction | DefineVariable

export type DefineFunction = {
  kind: "DefineFunction"
  name: string
  blocks: Map<string, Block>
  meta?: Meta
}

export function DefineFunction(
  name: string,
  blocks: Map<string, Block>,
  meta?: Meta,
): DefineFunction {
  return {
    kind: "DefineFunction",
    name,
    blocks,
    meta,
  }
}

export type DefineVariable = {
  kind: "DefineVariable"
  name: string
  value: Value
  meta?: Meta
}

export function DefineVariable(
  name: string,
  value: Value,
  meta?: Meta,
): DefineVariable {
  return {
    kind: "DefineVariable",
    name,
    value,
    meta,
  }
}
