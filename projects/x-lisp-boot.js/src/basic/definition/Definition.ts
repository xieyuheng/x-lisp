import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Block } from "../block/index.ts"
import type { Context } from "../execute/index.ts"
import type { Mod } from "../mod/index.ts"
import { type Value } from "../value/index.ts"

export type Definition = FunctionDefinition | PrimitiveFunctionDefinition

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  mod: Mod
  name: string
  blocks: Map<string, Block>
  meta?: Meta
}

export function FunctionDefinition(
  mod: Mod,
  name: string,
  blocks: Map<string, Block>,
  meta?: Meta,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    mod,
    name,
    blocks,
    meta,
  }
}

export type PrimitiveFunctionDefinition = {
  kind: "PrimitiveFunctionDefinition"
  mod: Mod
  name: string
  arity: number
  fn: (context: Context) => (...args: Array<Value>) => Value
}

export function PrimitiveFunctionDefinition(
  mod: Mod,
  name: string,
  arity: number,
  fn: (context: Context) => (...args: Array<Value>) => Value,
): PrimitiveFunctionDefinition {
  return {
    kind: "PrimitiveFunctionDefinition",
    mod,
    name,
    arity,
    fn,
  }
}
