import { setUnion, setUnionMany } from "@xieyuheng/helpers.js/set"
import type { SourceLocation } from "@xieyuheng/sexp.js"
import { expOccurredNames } from "../exp/expOccurredNames.ts"
import * as M from "../index.ts"
import { desugarBegin } from "./desugarBegin.ts"
import { generateRelativeFreshName } from "./generateRelativeFreshName.ts"

export function desugarHash(
  entries: Array<{ key: M.Exp; value: M.Exp }>,
  location: SourceLocation,
): M.Exp {
  const usedNames = setUnionMany(
    entries.map((entry) =>
      setUnion(expOccurredNames(entry.key), expOccurredNames(entry.value)),
    ),
  )
  const name = generateRelativeFreshName("hash", usedNames)

  return desugarBegin(
    [
      M.AssignExp(
        name,
        M.ApplyExp(
          M.QualifiedVarExp("meta-builtin", "builtin", "make-hash", location),
          [],
          location,
        ),
        location,
      ),
      ...entries.map((entry) =>
        M.ApplyExp(
          M.QualifiedVarExp("meta-builtin", "builtin", "hash-put!", location),
          [entry.key, entry.value, M.VarExp(name, location)],
          location,
        ),
      ),
      M.VarExp(name, location),
    ],
    location,
  )
}
