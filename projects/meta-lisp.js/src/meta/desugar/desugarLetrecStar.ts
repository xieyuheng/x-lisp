import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugarLetrecStar(
  bindings: Array<M.Binding>,
  body: M.Exp,
  location: SourceLocation,
): M.Exp {
  const newRHSes = bindings.map((b) => b.rhs)
  let newBody = body

  for (const b of bindings) {
    const loc = b.location ?? location
    const carExp = M.ApplyExp(
      M.QualifiedVarExp("builtin", "box-get", loc),
      [M.VarExp(b.name, loc)],
      loc,
    )
    for (let i = 0; i < newRHSes.length; i++) {
      newRHSes[i] = M.expNaiveSubst(newRHSes[i], b.name, carExp)
    }
    newBody = M.expNaiveSubst(newBody, b.name, carExp)
  }

  const letBindings = bindings.map((b) => {
    const loc = b.location ?? location
    return M.Binding(
      b.name,
      M.ApplyExp(M.QualifiedVarExp("builtin", "make-box", loc), [], loc),
      loc,
    )
  })

  let result: M.Exp = newBody
  for (let i = bindings.length - 1; i >= 0; i--) {
    const loc = bindings[i].location ?? location
    result = M.Begin1Exp(
      M.ApplyExp(
        M.QualifiedVarExp("builtin", "box-put!", loc),
        [newRHSes[i], M.VarExp(bindings[i].name, loc)],
        loc,
      ),
      result,
      loc,
    )
  }

  return M.LetExp(letBindings, result, location)
}
