import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import type { Exp } from "./Exp.ts"

export function expTraverse(onExp: (exp: Exp) => Exp, exp: Exp): Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "Var":
    case "QualifiedVar": {
      return onExp(exp)
    }

    case "Lambda": {
      return M.Lambda(exp.parameters, onExp(exp.body), exp.location)
    }

    case "Polymorphic": {
      return M.Polymorphic(exp.parameters, onExp(exp.body), exp.location)
    }

    case "Apply": {
      return M.Apply(
        onExp(exp.target),
        exp.args.map((e) => onExp(e)),
        exp.location,
      )
    }

    case "Pipe": {
      return M.Pipe(
        onExp(exp.target),
        exp.steps.map((e) => onExp(e)),
        exp.location,
      )
    }

    case "Chain": {
      return M.Chain(
        exp.steps.map((e) => onExp(e)),
        exp.location,
      )
    }

    case "Compose": {
      return M.Compose(
        exp.steps.map((e) => onExp(e)),
        exp.location,
      )
    }

    case "Let1": {
      return M.Let1(exp.name, onExp(exp.rhs), onExp(exp.body), exp.location)
    }

    case "Let": {
      return M.Let(
        exp.bindings.map((binding) =>
          M.Binding(binding.name, onExp(binding.rhs), binding.location),
        ),
        onExp(exp.body),
        exp.location,
      )
    }

    case "LetStar": {
      return M.LetStar(
        exp.bindings.map((binding) =>
          M.Binding(binding.name, onExp(binding.rhs), binding.location),
        ),
        onExp(exp.body),
        exp.location,
      )
    }

    case "Begin1": {
      return M.Begin1(onExp(exp.head), onExp(exp.body), exp.location)
    }

    case "Begin": {
      return M.Begin(exp.sequence.map(onExp), exp.location)
    }

    case "Assign": {
      return M.Assign(exp.name, onExp(exp.rhs), exp.location)
    }

    case "When": {
      return M.When(onExp(exp.condition), onExp(exp.consequent), exp.location)
    }

    case "Unless": {
      return M.Unless(
        onExp(exp.condition),
        onExp(exp.alternative),
        exp.location,
      )
    }

    case "And": {
      return M.And(exp.exps.map(onExp), exp.location)
    }

    case "Or": {
      return M.Or(exp.exps.map(onExp), exp.location)
    }

    case "Cond": {
      return M.Cond(
        exp.clauses.map((clause) => ({
          question: onExp(clause.question),
          answer: onExp(clause.answer),
        })),
        exp.location,
      )
    }

    case "If": {
      return M.If(
        onExp(exp.condition),
        onExp(exp.consequent),
        onExp(exp.alternative),
        exp.location,
      )
    }

    case "Quote": {
      return onExp(exp)
    }

    case "LiteralRecord": {
      return M.LiteralRecord(
        recordMapValue(exp.attributes, onExp),
        exp.location,
      )
    }

    case "LiteralList": {
      return M.LiteralList(exp.elements.map(onExp), exp.location)
    }

    case "LiteralSet": {
      return M.LiteralSet(exp.elements.map(onExp), exp.location)
    }

    case "LiteralHash": {
      return M.LiteralHash(
        exp.entries.map((entry) => ({
          key: onExp(entry.key),
          value: onExp(entry.value),
        })),
        exp.location,
      )
    }

    case "Arrow": {
      return M.Arrow(exp.argTypes.map(onExp), onExp(exp.retType), exp.location)
    }

    case "The": {
      return M.The(onExp(exp.type), onExp(exp.exp), exp.location)
    }

    case "Interface": {
      return M.Interface(
        recordMapValue(exp.attributeTypes, onExp),
        exp.location,
      )
    }

    case "ExtendInterface": {
      return M.ExtendInterface(
        onExp(exp.baseType),
        recordMapValue(exp.attributeTypes, onExp),
        exp.location,
      )
    }

    case "Extend": {
      return M.Extend(
        onExp(exp.base),
        recordMapValue(exp.attributes, onExp),
        exp.location,
      )
    }

    case "Update": {
      return M.Update(
        onExp(exp.base),
        recordMapValue(exp.attributes, onExp),
        exp.location,
      )
    }

    case "UpdateMut": {
      return M.UpdateMut(
        onExp(exp.base),
        recordMapValue(exp.attributes, onExp),
        exp.location,
      )
    }

    case "Match": {
      let message = `[expTraverse] can not handle Match`
      if (exp.location)
        throw new S.ErrorWithSourceLocation(message, exp.location)
      else throw new Error(message)
    }
  }
}
