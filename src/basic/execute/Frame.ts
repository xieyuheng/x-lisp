import type { Block } from "../block/index.ts"
import type { Value } from "../value/index.ts"

export type Frame = {
  name: string
  blocks: Map<string, Block>
  block: Block
  index: number
  env: Map<string, Value>
}
