import type { Block } from "../block/index.ts"

export type Definition = FunctionDefinition

export type FunctionDefinition = {
  name: string
  parameters: Array<string>
  blocks: Map<string, Block>
}
