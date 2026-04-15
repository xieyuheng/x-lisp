import { formatExp } from "../format/index.ts"
import * as Exps from "./index.ts"
import { type Exp } from "./index.ts"
import { type SourceLocation } from "@xieyuheng/sexp.js"

export function isLiteralList(value: Exp): value is Exps.LiteralList {
  return value.kind === "LiteralList"
}

export function asLiteralList(value: Exp): Exps.LiteralList {
  if (isLiteralList(value)) return value
  throw new Error(`[asList] fail on: ${formatExp(value)}`)
}

export function isLiteralRecord(value: Exp): value is Exps.LiteralRecord {
  return value.kind === "LiteralRecord"
}

export function asLiteralRecord(value: Exp): Exps.LiteralRecord {
  if (isLiteralRecord(value)) return value
  throw new Error(`[asObject] fail on: ${formatExp(value)}`)
}

export function Void(location?: SourceLocation): Exps.Var {
  return Exps.Var("void", location)
}

export function Bool(bool: boolean, location?: SourceLocation): Exps.Var {
  return Exps.Var(bool ? "true" : "false", location)
}

export function isBool(exp: Exp): boolean {
  return isTrue(exp) || isFalse(exp)
}

export function isTrue(exp: Exp): boolean {
  return exp.kind === "Var" && exp.name === "true"
}

export function isFalse(exp: Exp): boolean {
  return exp.kind === "Var" && exp.name === "false"
}
