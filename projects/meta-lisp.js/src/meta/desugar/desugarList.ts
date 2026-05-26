import { setUnionMany } from "@xieyuheng/helpers.js/set"
import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { expOccurredNames } from "../exp/expOccurredNames.ts"
import { desugarBegin } from "./desugarBegin.ts"
import { generateRelativeFreshName } from "./generateRelativeFreshName.ts"

export function desugarList(
  elements: Array<M.Exp>,
  location: SourceLocation,
): M.Exp {
  const usedNames = setUnionMany(elements.map(expOccurredNames))
  const name = generateRelativeFreshName("list", usedNames)

  return desugarBegin(
    [
      M.AssignExp(
        name,
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
          [e, M.VarExp(name, location)],
          location,
        ),
      ),
      M.VarExp(name, location),
    ],
    location,
  )
}
