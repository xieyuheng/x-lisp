import { type Span } from "@xieyuheng/x-data.js"
import { type Exp } from "../exp/index.ts"

type Meta = { span: Span }

export type Stmt = Compute | Define | Import | Assert

export type Compute = {
  kind: "Compute"
  exp: Exp
  meta: Meta
}

export type Define = {
  kind: "Define"
  name: string
  exp: Exp
  meta: Meta
}

export type Import = {
  kind: "Import"
  path: string
  entries: Array<ImportEntry>
  meta: Meta
}

export type ImportEntry = {
  name: string
  rename?: string
  meta: Meta
}

export type Assert = {
  kind: "Assert"
  exp: Exp
  meta: Meta
}

export function Compute(exp: Exp, meta: Meta): Compute {
  return {
    kind: "Compute",
    exp,
    meta,
  }
}

export function Define(name: string, exp: Exp, meta: Meta): Define {
  return {
    kind: "Define",
    name,
    exp,
    meta,
  }
}

export function Import(
  path: string,
  entries: Array<ImportEntry>,
  meta: Meta,
): Import {
  return {
    kind: "Import",
    path,
    entries,
    meta,
  }
}

export function Assert(exp: Exp, meta: Meta): Assert {
  return {
    kind: "Assert",
    exp,
    meta,
  }
}
