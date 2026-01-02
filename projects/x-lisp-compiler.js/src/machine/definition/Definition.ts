import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Block } from "../block/index.ts"
import type { Directive } from "../directive/index.ts"
import type { Mod } from "../mod/index.ts"
import type { Operand } from "../operand/index.ts"

export type Definition = CodeDefinition | DataDefinition | SpaceDefinition

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
  directives: Array<Directive>
  meta?: Meta
}

export function DataDefinition(
  mod: Mod,
  name: string,
  directives: Array<Directive>,
  meta?: Meta,
): DataDefinition {
  return {
    kind: "DataDefinition",
    mod,
    name,
    directives,
    meta,
  }
}

export type SpaceDefinition = {
  kind: "SpaceDefinition"
  mod: Mod
  name: string
  size: number
  meta?: Meta
}

export function SpaceDefinition(
  mod: Mod,
  name: string,
  size: number,
  meta?: Meta,
): SpaceDefinition {
  return {
    kind: "SpaceDefinition",
    mod,
    name,
    size,
    meta,
  }
}
