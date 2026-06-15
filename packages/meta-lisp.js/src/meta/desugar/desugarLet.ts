import { arrayAppend, arrayUnzip } from "@xieyuheng/helpers.js/array"
import { setUnion, setUnionMany } from "@xieyuheng/helpers.js/set"
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

  const usedNames = setUnion(
    M.expOccurredNames(body),
    setUnionMany(bindings.map((binding) => M.expOccurredNames(binding.rhs))),
  )

  return M.LetStarExp(desugarLetBindings(usedNames, bindings), body, location)
}

function desugarLetBindings(
  usedNames: Set<string>,
  bindings: Array<M.Binding>,
): Array<M.Binding> {
  return arrayAppend(
    ...arrayUnzip(
      bindings.map((binding) => desugarLetBinding(usedNames, binding)),
    ),
  )
}

function desugarLetBinding(
  usedNames: Set<string>,
  binding: M.Binding,
): [M.Binding, M.Binding] {
  const freshName = M.generateRelativeFreshName(binding.name, usedNames)
  usedNames.add(freshName)
  return [
    M.Binding(freshName, binding.rhs, binding.location),
    M.Binding(
      binding.name,
      M.VarExp(freshName, binding.location),
      binding.location,
    ),
  ]
}
