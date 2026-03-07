import { type TokenMeta } from "@xieyuheng/sexp.js"
import * as Exps from "./index.ts"

export function Bool(bool: boolean, meta?: TokenMeta): Exps.Var {
  return Exps.Var(bool ? "true" : "false", meta)
}
