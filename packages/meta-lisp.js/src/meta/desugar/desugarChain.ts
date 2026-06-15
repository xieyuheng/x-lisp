import { setUnionMany } from "@xieyuheng/helpers.js/set"
import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugarChain(
  steps: Array<M.Exp>,
  location: SourceLocation,
): M.Exp {
  const usedNames = setUnionMany(steps.map(M.expOccurredNames))
  const freshName = M.generateRelativeFreshName("target", usedNames)
  return M.LambdaExp(
    [freshName],
    M.PipeExp(M.VarExp(freshName, location), steps, location),
    location,
  )
}
