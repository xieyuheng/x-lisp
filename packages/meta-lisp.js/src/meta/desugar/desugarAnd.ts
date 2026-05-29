import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugarAnd(
  exps: Array<M.Exp>,
  location: SourceLocation,
): M.Exp {
  if (exps.length === 0) return M.QualifiedVarExp("self", "builtin", "true", location)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return M.IfExp(
    head,
    desugarAnd(restExps, location),
    M.QualifiedVarExp("self", "builtin", "false", location),
    location,
  )
}
