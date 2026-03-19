import { type TokenMeta } from "@xieyuheng/sexp.js"
import { formatExp } from "../format/index.ts"
import * as Exps from "./index.ts"
import { type Exp } from "./index.ts"

export function isList(value: Exp): value is Exps.LiteralList {
  return value.kind === "LiteralList"
}

export function asList(value: Exp): Exps.LiteralList {
  if (isList(value)) return value
  throw new Error(`[asList] fail on: ${formatExp(value)}`)
}

export function isObject(value: Exp): value is Exps.LiteralRecord {
  return value.kind === "LiteralRecord"
}

export function asObject(value: Exp): Exps.LiteralRecord {
  if (isObject(value)) return value
  throw new Error(`[asObject] fail on: ${formatExp(value)}`)
}

export function Bool(bool: boolean, meta?: TokenMeta): Exps.Var {
  return Exps.Var(bool ? "true" : "false", meta)
}

export function Void(meta?: TokenMeta): Exps.Var {
  return Exps.Var("void", meta)
}
