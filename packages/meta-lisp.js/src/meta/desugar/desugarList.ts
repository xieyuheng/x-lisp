import type { SourceLocation } from "@xieyuheng/sexp.js"
import { setUnionMany } from "@xieyuheng/std.js/set"
import { expOccurredNames } from "../exp/expOccurredNames.ts"
import * as M from "../index.ts"
import { generateRelativeFreshName } from "./generateRelativeFreshName.ts"

export function desugarList(
  elements: Array<M.Exp>,
  location: SourceLocation,
): M.Exp {
  const usedNames = setUnionMany(elements.map(expOccurredNames))
  const freshName = generateRelativeFreshName(usedNames, "list")

  const body = elements.reduceRight(
    (body: M.Exp, element: M.Exp): M.Exp =>
      M.Begin1Exp(
        M.ApplyExp(
          M.QualifiedVarExp("meta-builtin", "builtin", "list-push", location),
          [element, M.VarExp(freshName, location)],
          location,
        ),
        body,
        location,
      ),
    M.VarExp(freshName, location),
  )

  return M.Let1Exp(
    freshName,
    M.ApplyExp(
      M.QualifiedVarExp("meta-builtin", "builtin", "make-list", location),
      [],
      location,
    ),
    body,
    location,
  )
}
