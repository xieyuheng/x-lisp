import { formatExp } from "../format/index.ts"
import * as Exps from "./index.ts"
import { type Exp } from "./index.ts"

export function isList(value: Exp): value is Exps.List {
  return value.kind === "List"
}

export function asList(value: Exp): Exps.List {
  if (isList(value)) return value
  throw new Error(`[asList] fail on: ${formatExp(value)}`)
}

export function isObject(value: Exp): value is Exps.Object {
  return value.kind === "Object"
}

export function asObject(value: Exp): Exps.Object {
  if (isObject(value)) return value
  throw new Error(`[asObject] fail on: ${formatExp(value)}`)
}
