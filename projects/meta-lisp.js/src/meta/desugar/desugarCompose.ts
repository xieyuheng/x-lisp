import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { desugarChain } from "./desugarChain.ts"

export function desugarCompose(
  steps: Array<M.Exp>,
  location: SourceLocation,
): M.Exp {
  return desugarChain(steps.toReversed(), location)
}
