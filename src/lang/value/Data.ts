import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Value } from "./Value.ts"

export type DataSpec = {
  mod: Mod
  predicate: DataPredicate
  constructors: Record<string, DataConstructor>
}

export type AboutData =
  | Data
  | DataPredicate
  | DataConstructor
  | DataConstructorPredicate
  | DataGetter
  | DataSetter

export type Data = {
  kind: "Data"
  constructor: DataConstructor
  elements: Array<Value>
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

export type DataPredicate = {
  kind: "DataPredicate"
  spec: DataSpec
  name: string
  parameters: Array<string>
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

export type DataConstructorPredicate = {
  kind: "DataConstructorPredicate"
  constructor: DataConstructor
}

export function DataConstructorPredicate(
  constructor: DataConstructor,
): DataConstructorPredicate {
  return {
    kind: "DataConstructorPredicate",
    constructor,
  }
}

export type DataGetter = {
  kind: "DataGetter"
  constructor: DataConstructor
  fieldName: string
  fieldIndex: number
}

export function DataGetter(
  constructor: DataConstructor,
  fieldName: string,
  fieldIndex: number,
): DataGetter {
  return {
    kind: "DataGetter",
    constructor,
    fieldName,
    fieldIndex,
  }
}

export type DataSetter = {
  kind: "DataSetter"
  constructor: DataConstructor
  fieldName: string
  fieldIndex: number
}

export function DataSetter(
  constructor: DataConstructor,
  fieldName: string,
  fieldIndex: number,
): DataSetter {
  return {
    kind: "DataSetter",
    constructor,
    fieldName,
    fieldIndex,
  }
}
