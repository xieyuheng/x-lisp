import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugarLetrec(
  bindings: Array<M.Binding>,
  body: M.Exp,
  location: SourceLocation,
): M.Exp {
  const usedNames = M.expFreeNames(new Set(bindings.map((b) => b.name)), body)
  for (const binding of bindings) {
    const rhsFreeNames = M.expFreeNames(
      new Set(bindings.map((b) => b.name)),
      binding.rhs,
    )
    for (const name of rhsFreeNames) {
      usedNames.add(name)
    }
  }

  let newRHSes = bindings.map((b) => b.rhs)
  let newBody = body

  for (const b of bindings) {
    const loc = b.location ?? location
    const boxGetExp = M.ApplyExp(
      M.QualifiedVarExp("builtin", "box-get", loc),
      [M.VarExp(b.name, loc)],
      loc,
    )
    for (let i = 0; i < newRHSes.length; i++) {
      newRHSes[i] = M.expNaiveSubst(newRHSes[i], b.name, boxGetExp)
    }
    newBody = M.expNaiveSubst(newBody, b.name, boxGetExp)
  }

  const letBindings = bindings.map((b) => {
    const loc = b.location ?? location
    return M.Binding(
      b.name,
      M.ApplyExp(M.QualifiedVarExp("builtin", "make-box", loc), [], loc),
      loc,
    )
  })

  const freshNames = bindings.map((b) =>
    M.generateRelativeFreshName(`${b.name}.value`, usedNames),
  )

  const innerBindings = bindings.map((b, i) =>
    M.Binding(freshNames[i], newRHSes[i], b.location ?? location),
  )

  let result: M.Exp = newBody
  for (let i = bindings.length - 1; i >= 0; i--) {
    const loc = bindings[i].location ?? location
    result = M.Begin1Exp(
      M.ApplyExp(
        M.QualifiedVarExp("builtin", "box-put!", loc),
        [M.VarExp(freshNames[i], loc), M.VarExp(bindings[i].name, loc)],
        loc,
      ),
      result,
      loc,
    )
  }

  result = M.LetExp(innerBindings, result, location)
  return M.LetExp(letBindings, result, location)
}
