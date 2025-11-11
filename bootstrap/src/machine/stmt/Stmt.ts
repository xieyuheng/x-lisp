import { type TokenMeta as Meta } from "@xieyuheng/x-sexp.js"
import { type Block } from "../block/index.ts"
import type { AboutModule } from "./AboutModule.ts"

export type Stmt = DefineCode | AboutModule

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
