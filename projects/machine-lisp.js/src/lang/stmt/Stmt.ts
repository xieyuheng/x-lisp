import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Block } from "../block/index.ts"
import type { Chunk } from "../chunk/index.ts"
import type { AboutModule } from "./AboutModule.ts"

export type Stmt = DefineCode | DefineData | AboutModule

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

export type DefineData = {
  kind: "DefineData"
  name: string
  chunks: Map<string, Chunk>
  meta: Meta
}

export function DefineData(
  name: string,
  chunks: Map<string, Chunk>,
  meta: Meta,
): DefineData {
  return {
    kind: "DefineData",
    name,
    chunks,
    meta,
  }
}
