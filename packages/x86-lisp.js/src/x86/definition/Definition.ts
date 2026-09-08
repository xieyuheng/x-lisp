import type { Data } from "../data/index.ts"
import type { Instr } from "../instr/index.ts"
import type { Type } from "../type/index.ts"

export type Definition =
  | CodeDefinition
  | DataDefinition
  | SpaceDefinition
  | StructDefinition
  | PrimitiveTypeDefinition

export type CodeDefinition = {
  kind: "CodeDefinition"
  name: string
  instrs: Array<Instr>
}

export function CodeDefinition(
  name: string,
  instrs: Array<Instr>,
): CodeDefinition {
  return {
    kind: "CodeDefinition",
    name,
    instrs,
  }
}

export function isCodeDefinition(
  definition: Definition,
): definition is CodeDefinition {
  return definition.kind === "CodeDefinition"
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

export function isDataDefinition(
  definition: Definition,
): definition is DataDefinition {
  return definition.kind === "DataDefinition"
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

export function isSpaceDefinition(
  definition: Definition,
): definition is SpaceDefinition {
  return definition.kind === "SpaceDefinition"
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
