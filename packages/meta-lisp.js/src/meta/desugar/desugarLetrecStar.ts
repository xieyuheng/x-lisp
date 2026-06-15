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
  const substPairs = bindings.map(makeSubstPair)
  return M.LetExp(
    bindings.map(makeBoxBinding),
    M.BeginExp(
      [
        ...bindings.map((binding) => makeBoxPutExp(substPairs, binding)),
        expNaiveSubstMany(body, substPairs),
      ],
      location,
    ),
    location,
  )
}

function makeBoxBinding(binding: M.Binding): M.Binding {
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

function makeBoxPutExp(
  substPairs: Array<[string, M.Exp]>,
  binding: M.Binding,
): M.Exp {
  return M.ApplyExp(
    M.QualifiedVarExp("meta-builtin", "builtin", "box-put!", binding.location),
    [
      expNaiveSubstMany(binding.rhs, substPairs),
      M.VarExp(binding.name, binding.location),
    ],
    binding.location,
  )
}

function makeSubstPair(binding: M.Binding): [string, M.Exp] {
  return [binding.name, makeBoxGetExp(binding)]
}

function makeBoxGetExp(binding: M.Binding): M.Exp {
  return M.ApplyExp(
    M.QualifiedVarExp("meta-builtin", "builtin", "box-get", binding.location),
    [M.VarExp(binding.name, binding.location)],
    binding.location,
  )
}

function expNaiveSubstMany(exp: M.Exp, pairs: Array<[string, M.Exp]>): M.Exp {
  return pairs.reduce(expNaiveSubstPair, exp)
}

function expNaiveSubstPair(exp: M.Exp, pair: [string, M.Exp]): M.Exp {
  const [name, rhs] = pair
  return M.expNaiveSubst(exp, name, rhs)
}
