import { type TokenMeta as Meta } from "@xieyuheng/x-sexp.js"
import { type Exp } from "../exp/index.ts"
import { type DataField } from "../value/index.ts"
import type { AboutModule } from "./AboutModule.ts"

export type Stmt = Compute | Define | AboutModule | DefineData | Claim

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
