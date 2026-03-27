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
    case "Require": {
      return onExp(exp)
    }

    case "Lambda": {
      return M.Lambda(exp.parameters, onExp(exp.body), exp.meta)
    }

    case "Polymorphic": {
      return M.Polymorphic(exp.parameters, onExp(exp.body), exp.meta)
    }

    case "Apply": {
      return M.Apply(
        onExp(exp.target),
        exp.args.map((e) => onExp(e)),
        exp.meta,
      )
    }

    case "Let1": {
      return M.Let1(exp.name, onExp(exp.rhs), onExp(exp.body), exp.meta)
    }

    case "Begin1": {
      return M.Begin1(onExp(exp.head), onExp(exp.body), exp.meta)
    }

    case "BeginSugar": {
      return M.BeginSugar(exp.sequence.map(onExp), exp.meta)
    }

    case "AssignSugar": {
      return M.AssignSugar(exp.name, onExp(exp.rhs), exp.meta)
    }

    case "When": {
      return M.When(onExp(exp.condition), onExp(exp.consequent), exp.meta)
    }

    case "Unless": {
      return M.Unless(onExp(exp.condition), onExp(exp.alternative), exp.meta)
    }

    case "And": {
      return M.And(exp.exps.map(onExp), exp.meta)
    }

    case "Or": {
      return M.Or(exp.exps.map(onExp), exp.meta)
    }

    case "Cond": {
      return M.Cond(
        exp.clauses.map((clause) => ({
          question: onExp(clause.question),
          answer: onExp(clause.answer),
        })),
        exp.meta,
      )
    }

    case "If": {
      return M.If(
        onExp(exp.condition),
        onExp(exp.consequent),
        onExp(exp.alternative),
        exp.meta,
      )
    }

    case "Quote": {
      return onExp(exp)
    }

    case "LiteralRecord": {
      return M.LiteralRecord(recordMapValue(exp.attributes, onExp), exp.meta)
    }

    case "LiteralList": {
      return M.LiteralList(exp.elements.map(onExp), exp.meta)
    }

    case "LiteralTuple": {
      return M.LiteralTuple(exp.elements.map(onExp), exp.meta)
    }

    case "LiteralSet": {
      return M.LiteralSet(exp.elements.map(onExp), exp.meta)
    }

    case "LiteralHash": {
      return M.LiteralHash(
        exp.entries.map((entry) => ({
          key: onExp(entry.key),
          value: onExp(entry.value),
        })),
        exp.meta,
      )
    }

    case "Arrow": {
      return M.Arrow(exp.argTypes.map(onExp), onExp(exp.retType), exp.meta)
    }

    case "Tau": {
      return M.Tau(exp.elementTypes.map(onExp), exp.meta)
    }

    case "The": {
      return M.The(onExp(exp.type), onExp(exp.exp), exp.meta)
    }

    case "Interface": {
      return M.Interface(recordMapValue(exp.attributeTypes, onExp), exp.meta)
    }

    case "ExtendInterface": {
      return M.ExtendInterface(
        onExp(exp.baseType),
        recordMapValue(exp.attributeTypes, onExp),
        exp.meta,
      )
    }

    case "Extend": {
      return M.Extend(
        onExp(exp.base),
        recordMapValue(exp.attributes, onExp),
        exp.meta,
      )
    }

    case "Update": {
      return M.Update(
        onExp(exp.base),
        recordMapValue(exp.attributes, onExp),
        exp.meta,
      )
    }

    case "UpdateMut": {
      return M.UpdateMut(
        onExp(exp.base),
        recordMapValue(exp.attributes, onExp),
        exp.meta,
      )
    }

    case "Match": {
      let message = `[expTraverse] can not handle Match`
      if (exp.meta) throw new S.ErrorWithSourceLocation(message, exp.meta)
      else throw new Error(message)
    }
  }
}
