import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Exp } from "../exp/index.ts"
import type { AboutModule } from "./AboutModule.ts"

export type Stmt = AboutModule | DefineFunction | DefineVariable | DefineData

export type DefineFunction = {
  kind: "DefineFunction"
  name: string
  parameters: Array<string>
  body: Exp
  meta: Meta
}

export function DefineFunction(
  name: string,
  parameters: Array<string>,
  body: Exp,
  meta: Meta,
): DefineFunction {
  return {
    kind: "DefineFunction",
    name,
    parameters,
    body,
    meta,
  }
}

export type DefineVariable = {
  kind: "DefineVariable"
  name: string
  body: Exp
  meta: Meta
}

export function DefineVariable(
  name: string,
  body: Exp,
  meta: Meta,
): DefineVariable {
  return {
    kind: "DefineVariable",
    name,
    body,
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

export type DataField = {
  name: string
  predicate: Exp
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
