import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"

export type DataSpec = {
  mod: Mod
  predicate: DataPredicate
  constructors: Record<string, DataConstructor>
}

export type AboutData =
  | DataPredicate
  | DataConstructor
  | DataConstructorPredicate
  | DataGetter
  | DataPutter

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

export type DataPutter = {
  kind: "DataPutter"
  constructor: DataConstructor
  fieldName: string
  fieldIndex: number
}

export function DataPutter(
  constructor: DataConstructor,
  fieldName: string,
  fieldIndex: number,
): DataPutter {
  return {
    kind: "DataPutter",
    constructor,
    fieldName,
    fieldIndex,
  }
}
