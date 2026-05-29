import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugarCond(
  clauses: Array<M.CondClause>,
  location: SourceLocation,
): M.Exp {
  if (clauses.length === 0)
    return M.ApplyExp(
      M.QualifiedVarExp("meta-builtin", "builtin", "error", location),
      [M.StringExp("cond mismatch", location)],
      location,
    )
  const [headClause, ...resClauses] = clauses
  return M.IfExp(
    headClause.question,
    headClause.answer,
    desugarCond(resClauses, location),
    location,
  )
}
