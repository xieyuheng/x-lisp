import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Block } from "../block/index.ts"
import type { Metadata } from "../metadata/index.ts"
import type { Value } from "../value/index.ts"
import type { AboutModule } from "./AboutModule.ts"

export type Stmt =
  | AboutModule
  | DefineFunction
  | DefineVariable
  | DefineSetup
  | DefineMetadata
  | DefinePlaceholder

export type DefineFunction = {
  kind: "DefineFunction"
  name: string
  blocks: Map<string, Block>
  meta?: Meta
}

export function DefineFunction(
  name: string,
  blocks: Map<string, Block>,
  meta?: Meta,
): DefineFunction {
  return {
    kind: "DefineFunction",
    name,
    blocks,
    meta,
  }
}

export type DefineVariable = {
  kind: "DefineVariable"
  name: string
  value: Value
  meta?: Meta
}

export function DefineVariable(
  name: string,
  value: Value,
  meta?: Meta,
): DefineVariable {
  return {
    kind: "DefineVariable",
    name,
    value,
    meta,
  }
}

export type DefineSetup = {
  kind: "DefineSetup"
  name: string
  blocks: Map<string, Block>
  meta?: Meta
}

export function DefineSetup(
  name: string,
  blocks: Map<string, Block>,
  meta?: Meta,
): DefineSetup {
  return {
    kind: "DefineSetup",
    name,
    blocks,
    meta,
  }
}

export type DefineMetadata = {
  kind: "DefineMetadata"
  name: string
  attributes: Record<string, Metadata>
  meta?: Meta
}

export function DefineMetadata(
  name: string,
  attributes: Record<string, Metadata>,
  meta?: Meta,
): DefineMetadata {
  return {
    kind: "DefineMetadata",
    name,
    attributes,
    meta,
  }
}

export type DefinePlaceholder = {
  kind: "DefinePlaceholder"
  name: string
  meta?: Meta
}

export function DefinePlaceholder(
  name: string,
  meta?: Meta,
): DefinePlaceholder {
  return {
    kind: "DefinePlaceholder",
    name,
    meta,
  }
}
