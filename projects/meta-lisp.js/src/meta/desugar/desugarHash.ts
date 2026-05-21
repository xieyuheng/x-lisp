import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { desugarBegin } from "./desugarBegin.ts"

export function desugarHash(
  entries: Array<{ key: M.Exp; value: M.Exp }>,
  location: SourceLocation,
): M.Exp {
  return desugarBegin(
    [
      M.AssignExp(
        "hash",
        M.ApplyExp(
          M.QualifiedVarExp("builtin", "make-hash", location),
          [],
          location,
        ),
        location,
      ),
      ...entries.map((entry) =>
        M.ApplyExp(
          M.QualifiedVarExp("builtin", "hash-put!", location),
          [entry.key, entry.value, M.VarExp("hash", location)],
          location,
        ),
      ),
      M.VarExp("hash", location),
    ],
    location,
  )
}
