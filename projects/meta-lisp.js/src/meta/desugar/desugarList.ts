import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { desugarBegin } from "./desugarBegin.ts"

export function desugarList(
  elements: Array<M.Exp>,
  location: SourceLocation,
): M.Exp {
  return desugarBegin(
    [
      M.AssignExp(
        "list",
        M.ApplyExp(
          M.QualifiedVarExp("builtin", "make-list", location),
          [],
          location,
        ),
        location,
      ),
      ...elements.map((e) =>
        M.ApplyExp(
          M.QualifiedVarExp("builtin", "list-push!", location),
          [e, M.VarExp("list", location)],
          location,
        ),
      ),
      M.VarExp("list", location),
    ],
    location,
  )
}
