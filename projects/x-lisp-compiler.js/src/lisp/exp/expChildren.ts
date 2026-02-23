import type { Exp } from "./Exp.ts"

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

    case "Arrow": {
      return [...exp.argTypes, exp.retType]
    }
  }
}
