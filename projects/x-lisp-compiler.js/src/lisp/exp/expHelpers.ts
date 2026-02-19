import { recordMapValue } from "@xieyuheng/helpers.js/record"
import type { Exp } from "../index.ts"
import * as L from "../index.ts"

export function expMap(onExp: (exp: Exp) => Exp, exp: Exp): Exp {
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
  }
}

export function expChildren(exp: Exp): Array<Exp> {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "Var": {
      return []
    }

    case "Lambda": {
      return [exp.body]
    }

    case "Apply": {
      return [exp.target, ...exp.args]
    }

    case "Let1": {
      return [exp.rhs, exp.body]
    }

    case "Begin1": {
      return [exp.head, exp.body]
    }

    case "BeginSugar": {
      return exp.sequence
    }

    case "AssignSugar": {
      return [exp.rhs]
    }

    case "When": {
      return [exp.condition, exp.consequent]
    }

    case "Unless": {
      return [exp.condition, exp.alternative]
    }

    case "And": {
      return exp.exps
    }

    case "Or": {
      return exp.exps
    }

    case "If": {
      return [exp.condition, exp.consequent, exp.alternative]
    }

    case "Cond": {
      return exp.condLines.flatMap((condLine) => [
        condLine.question,
        condLine.answer,
      ])
    }

    case "Quote": {
      return []
    }

    case "Tael": {
      return [...exp.elements, ...Object.values(exp.attributes)]
    }

    case "Set": {
      return exp.elements
    }

    case "Hash": {
      return exp.entries.flatMap((entry) => [entry.key, entry.value])
    }
  }
}
