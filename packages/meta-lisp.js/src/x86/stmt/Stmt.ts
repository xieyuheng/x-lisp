import type { Block } from "../block/index.ts"
import type { Data } from "../data/index.ts"
import type { Type } from "../type/index.ts"

export type Stmt =
  | DefineCodeStmt
  | DefineDataStmt
  | DefineMetadataStmt
  | DefineStructStmt
  | DefineSpaceStmt

export type DefineCodeStmt = {
  kind: "DefineCodeStmt"
  name: string
  blocks: Array<Block>
}

export function DefineCodeStmt(
  name: string,
  blocks: Array<Block>,
): DefineCodeStmt {
  return {
    kind: "DefineCodeStmt",
    name,
    blocks,
  }
}

export type DefineDataStmt = {
  kind: "DefineDataStmt"
  name: string
  value: Data
}

export function DefineDataStmt(
  name: string,
  value: Data,
): DefineDataStmt {
  return {
    kind: "DefineDataStmt",
    name,
    value,
  }
}

export type DefineMetadataStmt = {
  kind: "DefineMetadataStmt"
  name: string
  value: Data
}

export function DefineMetadataStmt(
  name: string,
  value: Data,
): DefineMetadataStmt {
  return {
    kind: "DefineMetadataStmt",
    name,
    value,
  }
}

export type DefineStructStmt = {
  kind: "DefineStructStmt"
  name: string
  fields: Record<string, Type>
}

export function DefineStructStmt(
  name: string,
  fields: Record<string, Type>,
): DefineStructStmt {
  return {
    kind: "DefineStructStmt",
    name,
    fields,
  }
}

export type DefineSpaceStmt = {
  kind: "DefineSpaceStmt"
  name: string
  size: Data
}

export function DefineSpaceStmt(
  name: string,
  size: Data,
): DefineSpaceStmt {
  return {
    kind: "DefineSpaceStmt",
    name,
    size,
  }
}
