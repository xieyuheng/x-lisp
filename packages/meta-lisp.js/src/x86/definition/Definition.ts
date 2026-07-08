import type { Block } from "../block/index.ts"
import type { Data } from "../data/index.ts"
import type { Type } from "../type/index.ts"

export type Definition =
  | CodeDefinition
  | DataDefinition
  | MetadataDefinition
  | StructDefinition
  | SpaceDefinition
  | PrimitiveTypeDefinition

export type CodeDefinition = {
  kind: "CodeDefinition"
  name: string
  blocks: Array<Block>
}

export function CodeDefinition(
  name: string,
  blocks: Array<Block>,
): CodeDefinition {
  return {
    kind: "CodeDefinition",
    name,
    blocks,
  }
}

export type DataDefinition = {
  kind: "DataDefinition"
  name: string
  value: Data
}

export function DataDefinition(name: string, value: Data): DataDefinition {
  return {
    kind: "DataDefinition",
    name,
    value,
  }
}

export type MetadataDefinition = {
  kind: "MetadataDefinition"
  target: string
  value: Data
}

export function MetadataDefinition(
  target: string,
  value: Data,
): MetadataDefinition {
  return {
    kind: "MetadataDefinition",
    target,
    value,
  }
}

export type StructDefinition = {
  kind: "StructDefinition"
  name: string
  fields: Record<string, Type>
}

export function StructDefinition(
  name: string,
  fields: Record<string, Type>,
): StructDefinition {
  return {
    kind: "StructDefinition",
    name,
    fields,
  }
}

export type SpaceDefinition = {
  kind: "SpaceDefinition"
  name: string
  size: Data
}

export function SpaceDefinition(name: string, size: Data): SpaceDefinition {
  return {
    kind: "SpaceDefinition",
    name,
    size,
  }
}

export type PrimitiveTypeDefinition = {
  kind: "PrimitiveTypeDefinition"
  name: string
  size: number
}

export function PrimitiveTypeDefinition(
  name: string,
  size: number,
): PrimitiveTypeDefinition {
  return {
    kind: "PrimitiveTypeDefinition",
    name,
    size,
  }
}
