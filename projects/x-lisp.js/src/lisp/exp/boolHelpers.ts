import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { formatExp } from "../format/index.ts"
import * as Exps from "./index.ts"
import { type Exp } from "./index.ts"

export function Bool(bool: boolean, meta?: Meta): Exps.Keyword {
  return Exps.Keyword(bool ? "t" : "f", meta)
}

export function isBool(exp: Exp): boolean {
  return isTrue(exp) || isFalse(exp)
}

export function isTrue(exp: Exp): boolean {
  return exp.kind === "Keyword" && exp.content === "t"
}

export function isFalse(exp: Exp): boolean {
  return exp.kind === "Keyword" && exp.content === "f"
}

export function asBool(exp: Exp): Exps.Keyword {
  if (isBool(exp)) return exp as Exps.Keyword
  throw new Error(`[asBool] fail on: ${formatExp(exp)}`)
}
