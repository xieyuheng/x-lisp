import type { Exp } from "../index.ts"
import * as L from "../index.ts"

export function expMap(onExp: (exp: Exp) => Exp, exp: Exp): Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "Var":
    case "PrimitiveFunctionRef":
    case "PrimitiveConstantRef":
    case "FunctionRef":
    case "ConstantRef": {
      return onExp(exp)
    }

    case "Lambda": {
      return L.Lambda(exp.parameters, onExp(exp.body), exp.meta)
    }

    case "Apply": {
      return L.Apply(
        onExp(exp.target),
        exp.args.map((e) => onExp(e)),
        exp.meta,
      )
    }

    case "Let1": {
      return L.Let1(exp.name, onExp(exp.rhs), onExp(exp.body), exp.meta)
    }

    case "Begin1": {
      return L.Begin1(onExp(exp.head), onExp(exp.body), exp.meta)
    }

    case "BeginSugar": {
      return L.BeginSugar(exp.sequence.map(onExp), exp.meta)
    }

    case "AssignSugar": {
      return L.AssignSugar(exp.name, onExp(exp.rhs), exp.meta)
    }

    case "When": {
      return L.When(onExp(exp.condition), onExp(exp.consequent), exp.meta)
    }

    case "Unless": {
      return L.Unless(onExp(exp.condition), onExp(exp.consequent), exp.meta)
    }

    case "And": {
      return L.And(exp.exps.map(onExp), exp.meta)
    }

    case "Or": {
      return L.Or(exp.exps.map(onExp), exp.meta)
    }

    case "If": {
      return L.If(
        onExp(exp.condition),
        onExp(exp.consequent),
        onExp(exp.alternative),
        exp.meta,
      )
    }

    case "Assert": {
      return L.Assert(onExp(exp.target), exp.meta)
    }

    case "AssertEqual": {
      return L.AssertEqual(onExp(exp.lhs), onExp(exp.rhs), exp.meta)
    }

    case "AssertNotEqual": {
      return L.AssertNotEqual(onExp(exp.lhs), onExp(exp.rhs), exp.meta)
    }
  }
}
