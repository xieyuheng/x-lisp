import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugarLet(
  bindings: Array<M.Binding>,
  body: M.Exp,
  location: SourceLocation,
): M.Exp {
  if (bindings.length === 0) return body
  if (bindings.length === 1) {
    const [binding] = bindings
    return M.Let1Exp(binding.name, binding.rhs, body, location)
  }

  const [binding, ...restBindings] = bindings
  return M.Let1Exp(
    binding.name,
    binding.rhs,
    desugarLet(restBindings, body, location),
    location,
  )
}
