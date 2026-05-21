import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugarOr(exps: Array<M.Exp>, location: SourceLocation): M.Exp {
  if (exps.length === 0) return M.QualifiedVarExp("builtin", "false", location)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return M.IfExp(
    head,
    M.QualifiedVarExp("builtin", "true", location),
    desugarOr(restExps, location),
    location,
  )
}
