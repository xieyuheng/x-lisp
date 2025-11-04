import { type TokenMeta } from "@xieyuheng/x-sexp.js"
import { type Block } from "../block/index.ts"

type Meta = TokenMeta

export type Stmt = DefineFunction

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
