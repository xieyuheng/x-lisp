import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Block } from "../block/index.ts"
import type { Directive } from "../directive/index.ts"
import type { AboutModule } from "./AboutModule.ts"

export type Stmt = AboutModule | DefineCode | DefineData | DefineSpace

export type DefineCode = {
  kind: "DefineCode"
  name: string
  blocks: Map<string, Block>
  meta: Meta
}

export function DefineCode(
  name: string,
  blocks: Map<string, Block>,
  meta: Meta,
): DefineCode {
  return {
    kind: "DefineCode",
    name,
    blocks,
    meta,
  }
}

export type DefineData = {
  kind: "DefineData"
  name: string
  directives: Array<Directive>
  meta: Meta
}

export function DefineData(
  name: string,
  directives: Array<Directive>,
  meta: Meta,
): DefineData {
  return {
    kind: "DefineData",
    name,
    directives,
    meta,
  }
}

export type DefineSpace = {
  kind: "DefineSpace"
  name: string
  size: number
  meta: Meta
}

export function DefineSpace(
  name: string,
  size: number,
  meta: Meta,
): DefineSpace {
  return {
    kind: "DefineSpace",
    name,
    size,
    meta,
  }
}
