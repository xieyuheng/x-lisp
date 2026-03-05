import { type TokenMeta } from "@xieyuheng/sexp-tael.js"
import { formatExp } from "../format/index.ts"
import * as Exps from "./index.ts"
import { type Exp } from "./index.ts"

export function Void(meta?: TokenMeta): Exps.Hashtag {
  return Exps.Hashtag("void", meta)
}

export function isVoid(exp: Exp): boolean {
  return exp.kind === "Hashtag" && exp.content === "void"
}

export function asVoid(exp: Exp): Exps.Hashtag {
  if (isVoid(exp)) return exp as Exps.Hashtag
  throw new Error(`[asVoid] fail on: ${formatExp(exp)}`)
}
