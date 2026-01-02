import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { formatExp } from "../format/index.ts"
import * as Exps from "./index.ts"
import { type Exp } from "./index.ts"

export function Null(meta?: Meta): Exps.Hashtag {
  return Exps.Hashtag("void", meta)
}

export function isNull(exp: Exp): boolean {
  return exp.kind === "Hashtag" && exp.content === "void"
}

export function asNull(exp: Exp): Exps.Hashtag {
  if (isNull(exp)) return exp as Exps.Hashtag
  throw new Error(`[asNull] fail on: ${formatExp(exp)}`)
}
