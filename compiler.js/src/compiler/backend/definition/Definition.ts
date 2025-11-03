import type { Block } from "../block/index.ts"
import type { Value } from "../value/index.ts"

export type Definition = FunctionDefinition | PrimitiveFunctionDefinition

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  name: string
  parameters: Array<string>
  blocks: Map<string, Block>
}

export function FunctionDefinition(
  name: string,
  parameters: Array<string>,
  blocks: Map<string, Block>,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    name,
    parameters,
    blocks,
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
