import type { Block } from "../block/index.ts"

export type Stmt = DefineFunction

export type DefineFunction = {
  kind: "DefineFunction"
  name: string
  parameters: Array<string>
  blocks: Map<string, Block>
}

export function DefineFunction(
  name: string,
  parameters: Array<string>,
  blocks: Map<string, Block>,
): DefineFunction {
  return {
    kind: "DefineFunction",
    name,
    parameters,
    blocks,
  }
}
