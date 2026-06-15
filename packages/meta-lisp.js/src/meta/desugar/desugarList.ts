import { setUnionMany } from "@xieyuheng/helpers.js/set"
import type { SourceLocation } from "@xieyuheng/sexp.js"
import { expOccurredNames } from "../exp/expOccurredNames.ts"
import * as M from "../index.ts"
import { desugarBegin } from "./desugarBegin.ts"
import { generateRelativeFreshName } from "./generateRelativeFreshName.ts"

export function desugarList(
  elements: Array<M.Exp>,
  location: SourceLocation,
): M.Exp {
  const usedNames = setUnionMany(elements.map(expOccurredNames))
  const freshName = generateRelativeFreshName("list", usedNames)

  return desugarBegin(
    [
      M.AssignExp(
        freshName,
        M.ApplyExp(
          M.QualifiedVarExp("meta-builtin", "builtin", "make-list", location),
          [],
          location,
        ),
        location,
      ),
      ...elements.map((e) =>
        M.ApplyExp(
          M.QualifiedVarExp("meta-builtin", "builtin", "list-push!", location),
          [e, M.VarExp(freshName, location)],
          location,
        ),
      ),
      M.VarExp(freshName, location),
    ],
    location,
  )
}
