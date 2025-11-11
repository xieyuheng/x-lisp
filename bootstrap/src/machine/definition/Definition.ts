import { type TokenMeta as Meta } from "@xieyuheng/x-sexp.js"
import { type Block } from "../block/index.ts"
import type { Mod } from "../mod/index.ts"

export type Definition = CodeDefinition

export type CodeDefinition = {
  kind: "CodeDefinition"
  mod: Mod
  name: string
  blocks: Map<string, Block>
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
    meta,
  }
}
