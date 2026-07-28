import type { SourceLocation } from "@xieyuheng/sexp.js"
import { arrayMapZip, arrayZip } from "@xieyuheng/std.js/array"
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
//       (box-put! e1 x1)
//       (box-put! e2 x2)
//       ...
//       (box-put! en xn)
//       body)

export function desugarLetrec(
  bindings: Array<M.Binding>,
  body: M.Exp,
  location: SourceLocation,
): M.Exp {
  const boxBindings = bindings.map(makeBoxBinding)
  const boxGetExps = bindings.map(makeBoxGetExp)
  const names = bindings.map((binding) => binding.name)
  const expBoxGetSubst = (exp: M.Exp) =>
    expNaiveSubstMany(exp, names, boxGetExps)
  const newRhsExps = bindings.map((binding) => expBoxGetSubst(binding.rhs))
  const boxPutExps = arrayMapZip(makeBoxPutExp, newRhsExps, bindings)
  return M.LetExp(
    boxBindings,
    M.BeginExp([...boxPutExps, expBoxGetSubst(body)], location),
    location,
  )
}

export function makeBoxBinding(binding: M.Binding): M.Binding {
  return M.Binding(
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
  )
}

export function makeBoxGetExp(binding: M.Binding): M.Exp {
  return M.ApplyExp(
    M.QualifiedVarExp("meta-builtin", "builtin", "box-get", binding.location),
    [M.VarExp(binding.name, binding.location)],
    binding.location,
  )
}

export function makeBoxPutExp(valueExp: M.Exp, binding: M.Binding): M.Exp {
  return M.ApplyExp(
    M.QualifiedVarExp("meta-builtin", "builtin", "box-put!", binding.location),
    [valueExp, M.VarExp(binding.name, binding.location)],
    binding.location,
  )
}

export function expNaiveSubstMany(
  exp: M.Exp,
  names: Array<string>,
  rhsExps: Array<M.Exp>,
): M.Exp {
  return arrayZip(names, rhsExps).reduce(expNaiveSubstPair, exp)
}

function expNaiveSubstPair(exp: M.Exp, pair: [string, M.Exp]): M.Exp {
  const [name, rhs] = pair
  return M.expNaiveSubst(exp, name, rhs)
}
