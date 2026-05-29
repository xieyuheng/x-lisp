import { setUnionMany } from "@xieyuheng/helpers.js/set"
import type { SourceLocation } from "@xieyuheng/sexp.js"
import { expOccurredNames } from "../exp/expOccurredNames.ts"
import * as M from "../index.ts"
import { desugarBegin } from "./desugarBegin.ts"
import { generateRelativeFreshName } from "./generateRelativeFreshName.ts"

export function desugarSet(
  elements: Array<M.Exp>,
  location: SourceLocation,
): M.Exp {
  const usedNames = setUnionMany(elements.map(expOccurredNames))
  const name = generateRelativeFreshName("set", usedNames)

  return desugarBegin(
    [
      M.AssignExp(
        name,
        M.ApplyExp(
          M.QualifiedVarExp("self", "builtin", "make-set", location),
          [],
          location,
        ),
        location,
      ),
      ...elements.map((e) =>
        M.ApplyExp(
          M.QualifiedVarExp("self", "builtin", "set-add!", location),
          [e, M.VarExp(name, location)],
          location,
        ),
      ),
      M.VarExp(name, location),
    ],
    location,
  )
}
