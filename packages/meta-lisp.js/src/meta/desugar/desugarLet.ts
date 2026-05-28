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

  const usedNames = new Set<string>()
  for (const name of M.expOccurredNames(body)) usedNames.add(name)
  for (const b of bindings) {
    for (const name of M.expOccurredNames(b.rhs)) usedNames.add(name)
  }

  const tmpBindings: Array<M.Binding> = []
  const newBindings: Array<M.Binding> = []
  for (const binding of bindings) {
    const tmpName = M.generateRelativeFreshName(binding.name, usedNames)
    usedNames.add(tmpName)
    tmpBindings.push(M.Binding(tmpName, binding.rhs, binding.location))
    newBindings.push(
      M.Binding(
        binding.name,
        M.VarExp(tmpName, binding.location),
        binding.location,
      ),
    )
  }

  return M.LetStarExp([...tmpBindings, ...newBindings], body, location)
}
