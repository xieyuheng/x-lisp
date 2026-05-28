import { setUnionMany } from "@xieyuheng/helpers.js/set"
import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugarChain(
  steps: Array<M.Exp>,
  location: SourceLocation,
): M.Exp {
  const usedNames = setUnionMany(steps.map(M.expOccurredNames))
  const targetName = M.generateRelativeFreshName("target", usedNames)
  const target = M.VarExp(targetName, location)
  return M.LambdaExp([targetName], M.PipeExp(target, steps, location), location)
}
