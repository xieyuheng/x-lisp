import { type Span } from "@xieyuheng/x-data.js"
import { type Exp } from "../exp/index.ts"
import { type DataField } from "../value/index.ts"

type Meta = { span: Span }

export type Stmt = Compute | Define | Import | Require | DefineData | Claim

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

export type Require = {
  kind: "Require"
  path: string
  meta: Meta
}

export type ImportEntry = {
  name: string
  rename?: string
  meta: Meta
}

export type DefineData = {
  kind: "DefineData"
  predicate: DataPredicateSpec
  constructors: Array<DataConstructorSpec>
  meta: Meta
}

export type DataPredicateSpec = { name: string; parameters: Array<string> }
export type DataConstructorSpec = { name: string; fields: Array<DataField> }

export type Claim = {
  kind: "Claim"
  name: string
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

export function Require(path: string, meta: Meta): Require {
  return {
    kind: "Require",
    path,
    meta,
  }
}

export function DefineData(
  predicate: DataPredicateSpec,
  constructors: Array<DataConstructorSpec>,
  meta: Meta,
): DefineData {
  return {
    kind: "DefineData",
    predicate,
    constructors,
    meta,
  }
}

export function Claim(name: string, exp: Exp, meta: Meta): Claim {
  return {
    kind: "Claim",
    name,
    exp,
    meta,
  }
}
