import { type TokenMeta } from "@xieyuheng/sexp.js"
import { formatExp } from "../format/index.ts"
import * as Exps from "./index.ts"
import { type Exp } from "./index.ts"

export function Void(meta?: TokenMeta): Exps.Keyword {
  return Exps.Keyword("void", meta)
}

export function isVoid(exp: Exp): boolean {
  return exp.kind === "Keyword" && exp.content === "void"
}

export function asVoid(exp: Exp): Exps.Keyword {
  if (isVoid(exp)) return exp as Exps.Keyword
  throw new Error(`[asVoid] fail on: ${formatExp(exp)}`)
}
