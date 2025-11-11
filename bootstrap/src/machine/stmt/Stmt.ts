import { type TokenMeta as Meta } from "@xieyuheng/x-sexp.js"
import { type Block } from "../block/index.ts"

export type Stmt = DefineCode

export type DefineCode = {
  kind: "DefineCode"
  name: string
  blocks: Map<string, Block>
  meta: Meta
}

export function DefineCode(
  name: string,
  blocks: Map<string, Block>,
  meta: Meta,
): DefineCode {
  return {
    kind: "DefineCode",
    name,
    blocks,
    meta,
  }
}
