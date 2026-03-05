import { type TokenMeta } from "@xieyuheng/sexp.js"
import { formatExp } from "../format/index.ts"
import * as Exps from "./index.ts"
import { type Exp } from "./index.ts"

export function Null(meta?: TokenMeta): Exps.Keyword {
  return Exps.Keyword("void", meta)
}

export function isNull(exp: Exp): boolean {
  return exp.kind === "Keyword" && exp.content === "void"
}

export function asNull(exp: Exp): Exps.Keyword {
  if (isNull(exp)) return exp as Exps.Keyword
  throw new Error(`[asNull] fail on: ${formatExp(exp)}`)
}
