import { type TokenMeta as Meta } from "@xieyuheng/x-sexp.js"
import { type Block } from "../block/index.ts"
import type { Chunk } from "../chunk/index.ts"
import type { Mod } from "../mod/index.ts"
import type { Operand } from "../operand/index.ts"

export type Definition = CodeDefinition | DataDefinition

export type CodeDefinition = {
  kind: "CodeDefinition"
  mod: Mod
  name: string
  blocks: Map<string, Block>
  info: Partial<{
    "home-locations": Map<string, Operand>
  }>
  meta?: Meta
}

export function CodeDefinition(
  mod: Mod,
  name: string,
  blocks: Map<string, Block>,
  meta?: Meta,
): CodeDefinition {
  return {
    kind: "CodeDefinition",
    mod,
    name,
    blocks,
    info: {},
    meta,
  }
}

export type DataDefinition = {
  kind: "DataDefinition"
  mod: Mod
  name: string
  chunks: Map<string, Chunk>
  meta?: Meta
}

export function DataDefinition(
  mod: Mod,
  name: string,
  chunks: Map<string, Chunk>,
  meta?: Meta,
): DataDefinition {
  return {
    kind: "DataDefinition",
    mod,
    name,
    chunks,
    meta,
  }
}
