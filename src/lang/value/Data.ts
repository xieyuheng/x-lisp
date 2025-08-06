import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Value } from "./Value.ts"

export type DataSpec = {
  mod: Mod
  predicate: DataPredicate
  constructors: Record<string, DataConstructor>
}

export type Data = {
  kind: "Data"
  spec: DataSpec
  constructor: DataConstructor
  elements: Array<Value>
}

export type DataPredicate = {
  kind: "DataPredicate"
  spec: DataSpec
  name: string
  paramaters: Array<string>
}

export type DataConstructor = {
  kind: "DataConstructor"
  spec: DataSpec
  name: string
  fields: Array<DataField>
}

export type DataField = {
  name: string
  predicate: Exp
}

export type DataConstructorPredicate = {
  kind: "DataConstructorPredicate"
  spec: DataSpec
  constructor: DataConstructor
}

export function Data(
  spec: DataSpec,
  constructor: DataConstructor,
  elements: Array<Value>,
): Data {
  return {
    kind: "Data",
    spec,
    constructor,
    elements,
  }
}

export function DataConstructor(
  spec: DataSpec,
  name: string,
  fields: Array<DataField>,
): DataConstructor {
  return {
    kind: "DataConstructor",
    spec,
    name,
    fields,
  }
}
