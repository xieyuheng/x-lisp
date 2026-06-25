import { type SourceLocation } from "@xieyuheng/sexp.js"
import type { Block } from "../block/index.ts"
import type { Exp, StructField } from "../exp/index.ts"

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
  location: SourceLocation
}

export function DefineCodeStmt(
  name: string,
  blocks: Array<Block>,
  location: SourceLocation,
): DefineCodeStmt {
  return {
    kind: "DefineCodeStmt",
    name,
    blocks,
    location,
  }
}

export type DefineDataStmt = {
  kind: "DefineDataStmt"
  name: string
  value: Exp
  location: SourceLocation
}

export function DefineDataStmt(
  name: string,
  value: Exp,
  location: SourceLocation,
): DefineDataStmt {
  return {
    kind: "DefineDataStmt",
    name,
    value,
    location,
  }
}

export type DefineMetadataStmt = {
  kind: "DefineMetadataStmt"
  name: string
  value: Exp
  location: SourceLocation
}

export function DefineMetadataStmt(
  name: string,
  value: Exp,
  location: SourceLocation,
): DefineMetadataStmt {
  return {
    kind: "DefineMetadataStmt",
    name,
    value,
    location,
  }
}

export type DefineStructStmt = {
  kind: "DefineStructStmt"
  name: string
  fields: Array<StructField>
  location: SourceLocation
}

export function DefineStructStmt(
  name: string,
  fields: Array<StructField>,
  location: SourceLocation,
): DefineStructStmt {
  return {
    kind: "DefineStructStmt",
    name,
    fields,
    location,
  }
}

export type DefineSpaceStmt = {
  kind: "DefineSpaceStmt"
  name: string
  size: Exp
  location: SourceLocation
}

export function DefineSpaceStmt(
  name: string,
  size: Exp,
  location: SourceLocation,
): DefineSpaceStmt {
  return {
    kind: "DefineSpaceStmt",
    name,
    size,
    location,
  }
}
