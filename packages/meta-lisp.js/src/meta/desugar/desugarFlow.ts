import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugarFlow(
  target: M.Exp,
  steps: Array<M.Exp>,
  location: S.SourceLocation,
): M.Exp {
  let result = target
  for (const step of steps) {
    const location =
      target.location && step.location
        ? S.sourceLocationUnion(target.location, step.location)
        : target.location === undefined
          ? step.location
          : target.location
    result = M.ApplyExp(step, [result], location)
  }

  return result
}
