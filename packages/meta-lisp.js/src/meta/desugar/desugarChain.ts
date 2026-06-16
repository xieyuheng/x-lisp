import type { SourceLocation } from "@xieyuheng/sexp.js"
import { setUnionMany } from "@xieyuheng/std.js/set"
import * as M from "../index.ts"

export function desugarChain(
  steps: Array<M.Exp>,
  location: SourceLocation,
): M.Exp {
  const usedNames = setUnionMany(steps.map(M.expOccurredNames))
  const freshName = M.generateRelativeFreshName(usedNames, "target")
  return M.LambdaExp(
    [freshName],
    M.PipeExp(M.VarExp(freshName, location), steps, location),
    location,
  )
}
