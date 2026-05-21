import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { desugarBegin } from "./desugarBegin.ts"

export function desugarSet(
  elements: Array<M.Exp>,
  location: SourceLocation,
): M.Exp {
  return desugarBegin(
    [
      M.AssignExp(
        "set",
        M.ApplyExp(
          M.QualifiedVarExp("builtin", "make-set", location),
          [],
          location,
        ),
        location,
      ),
      ...elements.map((e) =>
        M.ApplyExp(
          M.QualifiedVarExp("builtin", "set-add!", location),
          [e, M.VarExp("set", location)],
          location,
        ),
      ),
      M.VarExp("set", location),
    ],
    location,
  )
}
