import type { SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

// Desugar `(letrec)` using box:
//
//     (letrec ((x1 e1)
//              (x2 e2)
//              ...
//              (xn en))
//       body)
//
// where e1, e2, en, and body have their
// x1, x2, xn replaced with (box-get x1), (box-get x2), (box-get xn)
//
//     (let ((x1 (make-box))
//           (x2 (make-box))
//           ...
//           (xn (make-box)))
//       (let ((v1 e1)
//             (v2 e2)
//             ...
//             (vn en))
//         (box-put! x1 v1)
//         (box-put! x2 v2)
//         ...
//         (box-put! xn vn)
//         body))

export function desugarLetrec(
  bindings: Array<M.Binding>,
  body: M.Exp,
  location: SourceLocation,
): M.Exp {
  const usedNames = M.expOccurredNames(body)
  for (const binding of bindings) {
    const rhsFreeNames = M.expOccurredNames(binding.rhs)
    for (const name of rhsFreeNames) {
      usedNames.add(name)
    }
  }

  let newRHSes = bindings.map((b) => b.rhs)
  let newBody = body

  // Using expNaiveSubst is safe here: we replace b.name with
  // (builtin.box-get b.name), whose only free variable is b.name itself.
  // When a binding inside the RHS or body shadows b.name, that occurrence
  // was never a recursive reference — stopping at the shadow is correct.
  for (const b of bindings) {
    const loc = b.location
    const boxGetExp = M.ApplyExp(
      M.QualifiedVarExp("meta-builtin", "builtin", "box-get", loc),
      [M.VarExp(b.name, loc)],
      loc,
    )
    for (let i = 0; i < newRHSes.length; i++) {
      newRHSes[i] = M.expNaiveSubst(newRHSes[i], b.name, boxGetExp)
    }
    newBody = M.expNaiveSubst(newBody, b.name, boxGetExp)
  }

  const letBindings = bindings.map((b) => {
    const loc = b.location
    return M.Binding(
      b.name,
      M.ApplyExp(
        M.QualifiedVarExp("meta-builtin", "builtin", "make-box", loc),
        [],
        loc,
      ),
      loc,
    )
  })

  const freshNames = bindings.map((b) =>
    M.generateRelativeFreshName(`${b.name}.value`, usedNames),
  )

  const innerBindings = bindings.map((b, i) =>
    M.Binding(freshNames[i], newRHSes[i], b.location),
  )

  let result: M.Exp = newBody
  for (let i = bindings.length - 1; i >= 0; i--) {
    const loc = bindings[i].location
    result = M.Begin1Exp(
      M.ApplyExp(
        M.QualifiedVarExp("meta-builtin", "builtin", "box-put!", loc),
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
