import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as M from "../index.ts"

export function expOccurredNames(exp: M.Exp): Set<string> {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "QualifiedVar":
    case "Quote": {
      return new Set()
    }

    case "Var": {
      return new Set([exp.name])
    }

    case "Lambda": {
      return setUnionMany([new Set(exp.parameters), expOccurredNames(exp.body)])
    }

    case "Polymorphic": {
      return setUnionMany([new Set(exp.parameters), expOccurredNames(exp.body)])
    }

    case "Let1": {
      return setUnionMany([
        new Set([exp.name]),
        expOccurredNames(exp.rhs),
        expOccurredNames(exp.body),
      ])
    }

    case "Let": {
      const allNames = exp.bindings.map((b) => b.name)
      return setUnionMany([
        new Set(allNames),
        ...exp.bindings.map((b) => expOccurredNames(b.rhs)),
        expOccurredNames(exp.body),
      ])
    }

    case "LetStar": {
      const allNames = exp.bindings.map((b) => b.name)
      return setUnionMany([
        new Set(allNames),
        ...exp.bindings.map((b) => expOccurredNames(b.rhs)),
        expOccurredNames(exp.body),
      ])
    }

    case "Apply": {
      return setUnionMany([
        expOccurredNames(exp.target),
        ...exp.args.map((a) => expOccurredNames(a)),
      ])
    }

    case "Pipe": {
      return setUnionMany([
        expOccurredNames(exp.target),
        ...exp.steps.map((s) => expOccurredNames(s)),
      ])
    }

    case "Chain": {
      return setUnionMany(exp.steps.map((s) => expOccurredNames(s)))
    }

    case "Compose": {
      return setUnionMany(exp.steps.map((s) => expOccurredNames(s)))
    }

    case "Begin1": {
      return setUnionMany([
        expOccurredNames(exp.head),
        expOccurredNames(exp.body),
      ])
    }

    case "Begin": {
      return setUnionMany(exp.sequence.map((e) => expOccurredNames(e)))
    }

    case "Assign": {
      return setUnionMany([new Set([exp.name]), expOccurredNames(exp.rhs)])
    }

    case "If": {
      return setUnionMany([
        expOccurredNames(exp.condition),
        expOccurredNames(exp.consequent),
        expOccurredNames(exp.alternative),
      ])
    }

    case "When": {
      return setUnionMany([
        expOccurredNames(exp.condition),
        expOccurredNames(exp.consequent),
      ])
    }

    case "Unless": {
      return setUnionMany([
        expOccurredNames(exp.condition),
        expOccurredNames(exp.alternative),
      ])
    }

    case "And": {
      return setUnionMany(exp.exps.map((e) => expOccurredNames(e)))
    }

    case "Or": {
      return setUnionMany(exp.exps.map((e) => expOccurredNames(e)))
    }

    case "Cond": {
      return setUnionMany(
        exp.clauses.flatMap((clause) => [
          expOccurredNames(clause.question),
          expOccurredNames(clause.answer),
        ]),
      )
    }

    case "LiteralList": {
      return setUnionMany(exp.elements.map((e) => expOccurredNames(e)))
    }

    case "LiteralSet": {
      return setUnionMany(exp.elements.map((e) => expOccurredNames(e)))
    }

    case "LiteralHash": {
      return setUnionMany(
        exp.entries.flatMap((entry) => [
          expOccurredNames(entry.key),
          expOccurredNames(entry.value),
        ]),
      )
    }

    case "Arrow": {
      return setUnionMany([
        ...exp.argTypes.map((t) => expOccurredNames(t)),
        expOccurredNames(exp.retType),
      ])
    }

    case "The": {
      return setUnionMany([
        expOccurredNames(exp.type),
        expOccurredNames(exp.exp),
      ])
    }

    case "Match": {
      return setUnionMany([
        ...exp.targets.map((t) => expOccurredNames(t)),
        ...exp.clauses.flatMap((clause) => [
          ...clause.patterns.map((p) => expOccurredNames(p)),
          expOccurredNames(clause.body),
        ]),
      ])
    }
  }
}
