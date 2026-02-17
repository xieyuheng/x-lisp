import type { DatatypeDefinition } from "../definition/index.ts"
import type { Value } from "./index.ts"

export type AboutDatatype =
  DatatypeValue
| DisjointUnionValue

export type DatatypeValue = {
  kind: "Datatype"
  definition: DatatypeDefinition
  args: Array<Value>
}

export function DatatypeValue(
  definition: DatatypeDefinition,
  args: Array<Value>,
): DatatypeValue {
  return {
    kind: "Datatype",
    definition,
    args,
  }
}

export type DisjointUnionValue = {
  kind: "DisjointUnion"
  types: Record<string, Value>
}

export function DisjointUnionValue(
  types: Record<string, Value>
): DisjointUnionValue {
  return {
    kind: "DisjointUnion",
types
  }
}
