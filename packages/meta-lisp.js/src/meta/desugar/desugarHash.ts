import type { SourceLocation } from "@xieyuheng/sexp.js"
import { setUnion, setUnionMany } from "@xieyuheng/std.js/set"
import { expOccurredNames } from "../exp/expOccurredNames.ts"
import * as M from "../index.ts"
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
  const freshName = generateRelativeFreshName(usedNames, "hash")

  const body = entries.reduceRight(
    (body: M.Exp, entry: { key: M.Exp; value: M.Exp }): M.Exp =>
      M.Begin1Exp(
        M.ApplyExp(
          M.QualifiedVarExp("meta-builtin", "builtin", "hash-put", location),
          [entry.key, entry.value, M.VarExp(freshName, location)],
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
      M.QualifiedVarExp("meta-builtin", "builtin", "make-hash", location),
      [],
      location,
    ),
    body,
    location,
  )
}
