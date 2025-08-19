import { type Span } from "@xieyuheng/x-data.js"
import { type Exp } from "../exp/index.ts"
import { type DataField } from "../value/index.ts"

export type Meta = { span: Span }

export type Stmt =
  | Compute
  | Define
  | Import
  | ImportAll
  | ImportAs
  | Include
  | DefineData
  | Claim

export type Compute = {
  kind: "Compute"
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

export type Define = {
  kind: "Define"
  name: string
  exp: Exp
  meta: Meta
}

export function Define(name: string, exp: Exp, meta: Meta): Define {
  return {
    kind: "Define",
    name,
    exp,
    meta,
  }
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

export type ImportAll = {
  kind: "ImportAll"
  path: string
  meta: Meta
}

export function ImportAll(path: string, meta: Meta): ImportAll {
  return {
    kind: "ImportAll",
    path,
    meta,
  }
}

export type ImportAs = {
  kind: "ImportAs"
  path: string
  name: string
  meta: Meta
}

export function ImportAs(path: string, name: string, meta: Meta): ImportAs {
  return {
    kind: "ImportAs",
    path,
    name,
    meta,
  }
}

export type Include = {
  kind: "Include"
  path: string
  meta: Meta
}

export function Include(path: string, meta: Meta): Include {
  return {
    kind: "Include",
    path,
    meta,
  }
}

export type DefineData = {
  kind: "DefineData"
  predicate: DataPredicateSpec
  constructors: Array<DataConstructorSpec>
  meta: Meta
}

export type DataPredicateSpec = {
  name: string
  parameters: Array<string>
}

export type DataConstructorSpec = {
  name: string
  fields: Array<DataField>
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

export type Claim = {
  kind: "Claim"
  name: string
  schema: Exp
  meta: Meta
}

export function Claim(name: string, schema: Exp, meta: Meta): Claim {
  return {
    kind: "Claim",
    name,
    schema,
    meta,
  }
}
