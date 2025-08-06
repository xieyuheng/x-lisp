import { type Exp } from "../exp/index.ts"
import { type Value } from "./Value.ts"

export type Data = {
  kind: "Data"
  spec: DataSpec
  constructor: DataConstructor
  elements: Array<Value>
}

export type DataSpec = {
  predicate: DataPredicate
  constructors: Record<string, DataConstructor>
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
