import { type SourceLocation } from "@xieyuheng/sexp.js"
import type { Block } from "../block/index.ts"
import type { Type } from "../type/index.ts"
import type { Value } from "../value/index.ts"

export type Definition =
  | CodeDefinition
  | DataDefinition
  | MetadataDefinition
  | StructDefinition
  | SpaceDefinition

export type CodeDefinition = {
  kind: "CodeDefinition"
  name: string
  blocks: Array<Block>
  location: SourceLocation
}

export function CodeDefinition(
  name: string,
  blocks: Array<Block>,
  location: SourceLocation,
): CodeDefinition {
  return {
    kind: "CodeDefinition",
    name,
    blocks,
    location,
  }
}

export type DataDefinition = {
  kind: "DataDefinition"
  name: string
  fields: Map<string, Value>
  location: SourceLocation
}

export function DataDefinition(
  name: string,
  fields: Map<string, Value>,
  location: SourceLocation,
): DataDefinition {
  return {
    kind: "DataDefinition",
    name,
    fields,
    location,
  }
}

export type MetadataDefinition = {
  kind: "MetadataDefinition"
  target: string
  fields: Map<string, Value>
  location: SourceLocation
}

export function MetadataDefinition(
  target: string,
  fields: Map<string, Value>,
  location: SourceLocation,
): MetadataDefinition {
  return {
    kind: "MetadataDefinition",
    target,
    fields,
    location,
  }
}

export type StructDefinition = {
  kind: "StructDefinition"
  name: string
  fields: Map<string, Type>
  location: SourceLocation
}

export function StructDefinition(
  name: string,
  fields: Map<string, Type>,
  location: SourceLocation,
): StructDefinition {
  return {
    kind: "StructDefinition",
    name,
    fields,
    location,
  }
}

export type SpaceDefinition = {
  kind: "SpaceDefinition"
  name: string
  size: bigint
  location: SourceLocation
}

export function SpaceDefinition(
  name: string,
  size: bigint,
  location: SourceLocation,
): SpaceDefinition {
  return {
    kind: "SpaceDefinition",
    name,
    size,
    location,
  }
}
