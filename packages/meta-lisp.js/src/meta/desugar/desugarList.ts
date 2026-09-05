import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugarList(
  elements: Array<M.Exp>,
  location: SourceLocation,
): M.Exp {
  const empty = M.ApplyExp(
    M.QualifiedVarExp("meta-builtin", "builtin", "make-list", location),
    [],
    location,
  )

  return elements.reduceRight(
    (acc: M.Exp, element: M.Exp): M.Exp =>
      M.ApplyExp(
        M.QualifiedVarExp("meta-builtin", "builtin", "cons", location),
        [element, acc],
        location,
      ),
    empty,
  )
}
