import type { SourceLocation } from "@xieyuheng/sexp.ts"

import * as M from "../index.ts"

export function desugarList(
  elements: Array<M.Exp>,
  location: SourceLocation,
): M.Exp {
  const empty = M.QualifiedVarExp("meta-builtin", "builtin", "null", location)

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
