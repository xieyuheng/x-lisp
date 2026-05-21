import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

// Desugar `(letrec*)` using box:
//
//     (letrec* ((x1 e1)
//               (x2 e2)
//               ...
//               (xn en))
//       body)
//
// where e1, e2, en, and body have their
// x1, x2, xn replaced with (box-get x1), (box-get x2), (box-get xn)
//
//     (let ((x1 (make-box))
//           (x2 (make-box))
//           ...
//           (xn (make-box)))
//       (box-put! e1 x1)
//       (box-put! e2 x2)
//       ...
//       (box-put! en xn)
//       body)

export function desugarLetrecStar(
  bindings: Array<M.Binding>,
  body: M.Exp,
  location: SourceLocation,
): M.Exp {
  const newRHSes = bindings.map((b) => b.rhs)
  let newBody = body

  // Same reasoning as desugarLetrec — expNaiveSubst is safe here:
  // carExp only refers to b.name, and any inner shadowing means
  // that occurrence was never a recursive reference.
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
