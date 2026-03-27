import * as S from "@xieyuheng/sexp.js"
import type { Exp } from "./Exp.ts"

export function expChildren(exp: Exp): Array<Exp> {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "Var": {
      return []
    }

    case "Require": {
      return []
    }

    case "Lambda": {
      return [exp.body]
    }

    case "Polymorphic": {
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
      return exp.clauses.flatMap((clause) => [clause.question, clause.answer])
    }

    case "Quote": {
      return []
    }

    case "LiteralList": {
      return exp.elements
    }

    case "LiteralTuple": {
      return exp.elements
    }

    case "LiteralRecord": {
      return Object.values(exp.attributes)
    }

    case "LiteralSet": {
      return exp.elements
    }

    case "LiteralHash": {
      return exp.entries.flatMap((entry) => [entry.key, entry.value])
    }

    case "Arrow": {
      return [...exp.argTypes, exp.retType]
    }

    case "Tau": {
      return exp.elementTypes
    }

    case "The": {
      return [exp.type, exp.exp]
    }

    case "Match": {
      let message = `[expChildren] can not handle Match`
      if (exp.location)
        throw new S.ErrorWithSourceLocation(message, exp.location)
      else throw new Error(message)
    }

    case "Interface": {
      return Object.values(exp.attributeTypes)
    }

    case "ExtendInterface": {
      return [exp.baseType, ...Object.values(exp.attributeTypes)]
    }

    case "Extend":
    case "Update":
    case "UpdateMut": {
      return [exp.base, ...Object.values(exp.attributes)]
    }
  }
}
