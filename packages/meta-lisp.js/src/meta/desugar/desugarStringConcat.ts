import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugarStringConcat(
  elements: Array<M.Exp>,
  location: SourceLocation,
): M.Exp {
  return M.ApplyExp(
    M.QualifiedVarExp("meta-builtin", "builtin", "string-concat", location),
    [M.ListExp(elements, location)],
    location,
  )
}
