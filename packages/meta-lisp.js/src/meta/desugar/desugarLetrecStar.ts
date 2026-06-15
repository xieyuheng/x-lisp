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
  const newRHSes = bindings.map((binding) => binding.rhs)
  let newBody = body

  // Same reasoning as desugarLetrec — expNaiveSubst is safe here:
  // unboxExp only refers to b.name, and any inner shadowing means
  // that occurrence was never a recursive reference.
  for (const binding of bindings) {
    const unboxExp = M.ApplyExp(
      M.QualifiedVarExp("meta-builtin", "builtin", "box-get", binding.location),
      [M.VarExp(binding.name, binding.location)],
      binding.location,
    )
    for (let i = 0; i < newRHSes.length; i++) {
      newRHSes[i] = M.expNaiveSubst(newRHSes[i], binding.name, unboxExp)
    }
    newBody = M.expNaiveSubst(newBody, binding.name, unboxExp)
  }

  const letBindings = bindings.map((binding) =>
    M.Binding(
      binding.name,
      M.ApplyExp(
        M.QualifiedVarExp(
          "meta-builtin",
          "builtin",
          "make-box",
          binding.location,
        ),
        [],
        binding.location,
      ),
      binding.location,
    ),
  )

  return M.LetExp(
    letBindings,
    M.BeginExp(
      [
        ...bindings.map((binding, index) =>
          M.ApplyExp(
            M.QualifiedVarExp(
              "meta-builtin",
              "builtin",
              "box-put!",
              binding.location,
            ),
            [newRHSes[index], M.VarExp(bindings[index].name, binding.location)],
            binding.location,
          ),
        ),
        newBody,
      ],
      location,
    ),
    location,
  )
}
