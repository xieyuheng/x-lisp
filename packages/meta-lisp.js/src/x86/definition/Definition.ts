import { type SourceLocation } from "@xieyuheng/sexp.js"
import type { Block } from "../block/index.ts"
import type { Exp, StructField } from "../exp/index.ts"
import type { TypeConstructor } from "../type/index.ts"

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
  value: Exp
  location: SourceLocation
}

export function DataDefinition(
  name: string,
  value: Exp,
  location: SourceLocation,
): DataDefinition {
  return {
    kind: "DataDefinition",
    name,
    value,
    location,
  }
}

export type MetadataDefinition = {
  kind: "MetadataDefinition"
  target: string
  value: Exp
  location: SourceLocation
}

export function MetadataDefinition(
  target: string,
  value: Exp,
  location: SourceLocation,
): MetadataDefinition {
  return {
    kind: "MetadataDefinition",
    target,
    value,
    location,
  }
}

export type StructDefinition = {
  kind: "StructDefinition"
  name: string
  typeConstructor: TypeConstructor
  fields: Array<StructField>
  location: SourceLocation
}

export function StructDefinition(
  name: string,
  typeConstructor: TypeConstructor,
  fields: Array<StructField>,
  location: SourceLocation,
): StructDefinition {
  return {
    kind: "StructDefinition",
    name,
    typeConstructor,
    fields,
    location,
  }
}

export type SpaceDefinition = {
  kind: "SpaceDefinition"
  name: string
  size: Exp
  location: SourceLocation
}

export function SpaceDefinition(
  name: string,
  size: Exp,
  location: SourceLocation,
): SpaceDefinition {
  return {
    kind: "SpaceDefinition",
    name,
    size,
    location,
  }
}

export type PrimitiveTypeDefinition = {
  kind: "PrimitiveTypeDefinition"
  name: string
  typeConstructor: TypeConstructor
  location: SourceLocation
}

export function PrimitiveTypeDefinition(
  name: string,
  typeConstructor: TypeConstructor,
  location: SourceLocation,
): PrimitiveTypeDefinition {
  return {
    kind: "PrimitiveTypeDefinition",
    name,
    typeConstructor,
    location,
  }
}
