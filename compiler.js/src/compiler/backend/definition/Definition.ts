import { type TokenMeta as Meta } from "@xieyuheng/x-sexp.js"
import { type Block } from "../block/index.ts"
import { type Value } from "../value/index.ts"

export type Definition = FunctionDefinition | PrimitiveFunctionDefinition

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  name: string
  blocks: Map<string, Block>
  meta?: Meta
}

export function FunctionDefinition(
  name: string,
  blocks: Map<string, Block>,
  meta?: Meta,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    name,
    blocks,
    meta,
  }
}

export type PrimitiveFunctionDefinition = {
  kind: "PrimitiveFunctionDefinition"
  name: string
  arity: number
  fn: (...args: Array<Value>) => Value
}

export function PrimitiveFunctionDefinition(
  name: string,
  arity: number,
  fn: (...args: Array<Value>) => Value,
): PrimitiveFunctionDefinition {
  return {
    kind: "PrimitiveFunctionDefinition",
    name,
    arity,
    fn,
  }
}
