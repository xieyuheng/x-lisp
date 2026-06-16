import { arrayMapZip } from "@xieyuheng/helpers.js/array"
import { setUnion, setUnionMany } from "@xieyuheng/helpers.js/set"
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
  const boxBindings = bindings.map(M.makeBoxBinding)
  const boxGetExps = bindings.map(M.makeBoxGetExp)
  const names = bindings.map((binding) => binding.name)
  const expUnbox = (exp: M.Exp) => M.expNaiveSubstMany(exp, names, boxGetExps)
  const newRhsExps = bindings.map((binding) => expUnbox(binding.rhs))
  const usedNames = setUnion(
    M.expOccurredNames(body),
    setUnionMany(bindings.map((binding) => M.expOccurredNames(binding.rhs))),
  )
  const tmpBindings = arrayMapZip(
    makeTmpBinding(usedNames),
    bindings,
    newRhsExps,
  )
  const tmpVarExps = tmpBindings.map(makeBindingVarExp)
  const boxPutExps = arrayMapZip(M.makeBoxPutExp, tmpVarExps, bindings)
  return M.LetExp(
    boxBindings,
    M.LetExp(
      tmpBindings,
      M.BeginExp([...boxPutExps, expUnbox(body)], location),
      location,
    ),
    location,
  )
}

function makeTmpBinding(
  usedNames: Set<string>,
): (binding: M.Binding, rhs: M.Exp) => M.Binding {
  return (binding, rhs) =>
    M.Binding(
      M.generateRelativeFreshName(`${binding.name}.value`, usedNames),
      rhs,
      binding.location,
    )
}

function makeBindingVarExp(binding: M.Binding): M.Exp {
  return M.VarExp(binding.name, binding.location)
}
