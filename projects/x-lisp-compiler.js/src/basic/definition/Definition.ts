import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Block } from "../block/index.ts"
import type { Metadata } from "../metadata/index.ts"
import type { Mod } from "../mod/index.ts"
import { type Value } from "../value/index.ts"

export type Definition =
  | FunctionDefinition
  | PrimitiveFunctionDefinition
  | VariableDefinition
  | SetupDefinition
  | MetadataDefinition
  | PlaceholderDefinition

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  mod: Mod
  name: string
  blocks: Map<string, Block>
  meta?: Meta
}

export function FunctionDefinition(
  mod: Mod,
  name: string,
  blocks: Map<string, Block>,
  meta?: Meta,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    mod,
    name,
    blocks,
    meta,
  }
}

export type PrimitiveFunctionDefinition = {
  kind: "PrimitiveFunctionDefinition"
  mod: Mod
  name: string
  arity: number
}

export function PrimitiveFunctionDefinition(
  mod: Mod,
  name: string,
  arity: number,
): PrimitiveFunctionDefinition {
  return {
    kind: "PrimitiveFunctionDefinition",
    mod,
    name,
    arity,
  }
}

export type VariableDefinition = {
  kind: "VariableDefinition"
  mod: Mod
  name: string
  value: Value
  meta?: Meta
}

export function VariableDefinition(
  mod: Mod,
  name: string,
  value: Value,
  meta?: Meta,
): VariableDefinition {
  return {
    kind: "VariableDefinition",
    mod,
    name,
    value,
    meta,
  }
}

export type SetupDefinition = {
  kind: "SetupDefinition"
  mod: Mod
  name: string
  blocks: Map<string, Block>
  meta?: Meta
}

export function SetupDefinition(
  mod: Mod,
  name: string,
  blocks: Map<string, Block>,
  meta?: Meta,
): SetupDefinition {
  return {
    kind: "SetupDefinition",
    mod,
    name,
    blocks,
    meta,
  }
}

export type MetadataDefinition = {
  kind: "MetadataDefinition"
  mod: Mod
  name: string
  attributes: Record<string, Metadata>
  meta?: Meta
}

export function MetadataDefinition(
  mod: Mod,
  name: string,
  attributes: Record<string, Metadata>,
  meta?: Meta,
): MetadataDefinition {
  return {
    kind: "MetadataDefinition",
    mod,
    name,
    attributes,
    meta,
  }
}

export type PlaceholderDefinition = {
  kind: "PlaceholderDefinition"
  mod: Mod
  name: string
  meta?: Meta
}

export function PlaceholderDefinition(
  mod: Mod,
  name: string,
  meta?: Meta,
): PlaceholderDefinition {
  return {
    kind: "PlaceholderDefinition",
    mod,
    name,
    meta,
  }
}
