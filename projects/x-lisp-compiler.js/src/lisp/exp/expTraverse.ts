import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as L from "../index.ts"
import type { Exp } from "./Exp.ts"

export function expTraverse(onExp: (exp: Exp) => Exp, exp: Exp): Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "Var": {
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
      return L.Unless(onExp(exp.condition), onExp(exp.alternative), exp.meta)
    }

    case "And": {
      return L.And(exp.exps.map(onExp), exp.meta)
    }

    case "Or": {
      return L.Or(exp.exps.map(onExp), exp.meta)
    }

    case "Cond": {
      return L.Cond(
        exp.condLines.map((condLine) => ({
          question: onExp(condLine.question),
          answer: onExp(condLine.answer),
        })),
        exp.meta,
      )
    }

    case "If": {
      return L.If(
        onExp(exp.condition),
        onExp(exp.consequent),
        onExp(exp.alternative),
        exp.meta,
      )
    }

    case "Quote": {
      return onExp(exp)
    }

    case "Tael": {
      return L.Tael(
        exp.elements.map(onExp),
        recordMapValue(exp.attributes, onExp),
        exp.meta,
      )
    }

    case "Set": {
      return L.Set(exp.elements.map(onExp), exp.meta)
    }

    case "Hash": {
      return L.Hash(
        exp.entries.map((entry) => ({
          key: onExp(entry.key),
          value: onExp(entry.value),
        })),
        exp.meta,
      )
    }

    case "Arrow": {
      return L.Arrow(exp.argTypes.map(onExp), onExp(exp.retType), exp.meta)
    }

    case "The": {
      return L.The(onExp(exp.type), onExp(exp.exp), exp.meta)
    }
  }
}
