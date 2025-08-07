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
  constructor: DataConstructor
  elements: Array<Value>
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

export type DataPredicate = {
  kind: "DataPredicate"
  spec: DataSpec
  name: string
  parameters: Array<string>
}

export type DataConstructorPredicate = {
  kind: "DataConstructorPredicate"
  constructor: DataConstructor
}

export function Data(
  constructor: DataConstructor,
  elements: Array<Value>,
): Data {
  return {
    kind: "Data",
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

export function DataPredicate(
  spec: DataSpec,
  name: string,
  parameters: Array<string>,
): DataPredicate {
  return {
    kind: "DataPredicate",
    spec,
    name,
    parameters,
  }
}

export function DataConstructorPredicate(
  constructor: DataConstructor,
): DataConstructorPredicate {
  return {
    kind: "DataConstructorPredicate",
    constructor,
  }
}
