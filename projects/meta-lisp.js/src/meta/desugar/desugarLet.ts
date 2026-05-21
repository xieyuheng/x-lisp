import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { type State } from "./desugarState.ts"

export function desugarLet(
  state: State,
  bindings: Array<M.Binding>,
  body: M.Exp,
  location: SourceLocation,
): M.Exp {
  if (bindings.length === 0) return body
  if (bindings.length === 1) {
    const [binding] = bindings
    return M.Let1Exp(binding.name, binding.rhs, body, location)
  }

  const tmpBindings: Array<M.Binding> = []
  const newBindings: Array<M.Binding> = []
  for (const binding of bindings) {
    const tmpName = generateFreshName(state, binding.name)
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

export function generateFreshName(state: State, name: string): string {
  const count = state.nameCounts.get(name)
  if (count) {
    state.nameCounts.set(name, count + 1)
    return `${name}.${count + 1}`
  } else {
    state.nameCounts.set(name, 1)
    return `${name}.${1}`
  }
}
