import type { Block } from "../block/index.ts"

export type Definition = FunctionDefinition

export type FunctionDefinition = {
  blocks: Map<string, Block>
}
