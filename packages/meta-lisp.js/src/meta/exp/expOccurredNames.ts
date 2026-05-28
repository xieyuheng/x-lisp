import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as M from "../index.ts"

export function expOccurredNames(exp: M.Exp): Set<string> {
  switch (exp.kind) {
    case "SymbolExp":
    case "KeywordExp":
    case "StringExp":
    case "IntExp":
    case "FloatExp":
    case "QualifiedVarExp":
    case "QuoteExp":
    case "SexpExp":
    case "CommentExp": {
      return new Set()
    }

    case "VarExp": {
      return new Set([exp.name])
    }

    case "LambdaExp": {
      return setUnionMany([new Set(exp.parameters), expOccurredNames(exp.body)])
    }

    case "PolymorphicExp": {
      return setUnionMany([new Set(exp.parameters), expOccurredNames(exp.body)])
    }

    case "Let1Exp": {
      return setUnionMany([
        new Set([exp.name]),
        expOccurredNames(exp.rhs),
        expOccurredNames(exp.body),
      ])
    }

    case "LetExp": {
      const allNames = exp.bindings.map((b) => b.name)
      return setUnionMany([
        new Set(allNames),
        ...exp.bindings.map((b) => expOccurredNames(b.rhs)),
        expOccurredNames(exp.body),
      ])
    }

    case "LetStarExp": {
      const allNames = exp.bindings.map((b) => b.name)
      return setUnionMany([
        new Set(allNames),
        ...exp.bindings.map((b) => expOccurredNames(b.rhs)),
        expOccurredNames(exp.body),
      ])
    }

    case "LetrecExp": {
      const allNames = exp.bindings.map((b) => b.name)
      return setUnionMany([
        new Set(allNames),
        ...exp.bindings.map((b) => expOccurredNames(b.rhs)),
        expOccurredNames(exp.body),
      ])
    }

    case "LocalDefineExp": {
      return setUnionMany([
        new Set([exp.name, ...exp.parameters]),
        expOccurredNames(exp.body),
      ])
    }

    case "LetrecStarExp": {
      const allNames = exp.bindings.map((b) => b.name)
      return setUnionMany([
        new Set(allNames),
        ...exp.bindings.map((b) => expOccurredNames(b.rhs)),
        expOccurredNames(exp.body),
      ])
    }

    case "ApplyExp": {
      return setUnionMany([
        expOccurredNames(exp.target),
        ...exp.args.map((a) => expOccurredNames(a)),
      ])
    }

    case "PipeExp": {
      return setUnionMany([
        expOccurredNames(exp.target),
        ...exp.steps.map((s) => expOccurredNames(s)),
      ])
    }

    case "ChainExp": {
      return setUnionMany(exp.steps.map((s) => expOccurredNames(s)))
    }

    case "ComposeExp": {
      return setUnionMany(exp.steps.map((s) => expOccurredNames(s)))
    }

    case "Begin1Exp": {
      return setUnionMany([
        expOccurredNames(exp.head),
        expOccurredNames(exp.body),
      ])
    }

    case "BeginExp": {
      return setUnionMany(exp.sequence.map((e) => expOccurredNames(e)))
    }

    case "AssignExp": {
      return setUnionMany([new Set([exp.name]), expOccurredNames(exp.rhs)])
    }

    case "IfExp": {
      return setUnionMany([
        expOccurredNames(exp.condition),
        expOccurredNames(exp.consequent),
        expOccurredNames(exp.alternative),
      ])
    }

    case "WhenExp": {
      return setUnionMany([
        expOccurredNames(exp.condition),
        expOccurredNames(exp.consequent),
      ])
    }

    case "UnlessExp": {
      return setUnionMany([
        expOccurredNames(exp.condition),
        expOccurredNames(exp.alternative),
      ])
    }

    case "AndExp": {
      return setUnionMany(exp.exps.map((e) => expOccurredNames(e)))
    }

    case "OrExp": {
      return setUnionMany(exp.exps.map((e) => expOccurredNames(e)))
    }

    case "CondExp": {
      return setUnionMany(
        exp.clauses.flatMap((clause) => [
          expOccurredNames(clause.question),
          expOccurredNames(clause.answer),
        ]),
      )
    }

    case "ListExp": {
      return setUnionMany(exp.elements.map((e) => expOccurredNames(e)))
    }

    case "StringConcatExp": {
      return setUnionMany(exp.elements.map((e) => expOccurredNames(e)))
    }

    case "SetExp": {
      return setUnionMany(exp.elements.map((e) => expOccurredNames(e)))
    }

    case "HashExp": {
      return setUnionMany(
        exp.entries.flatMap((entry) => [
          expOccurredNames(entry.key),
          expOccurredNames(entry.value),
        ]),
      )
    }

    case "ArrowExp": {
      return setUnionMany([
        ...exp.argTypes.map((t) => expOccurredNames(t)),
        expOccurredNames(exp.retType),
      ])
    }

    case "TheExp": {
      return setUnionMany([
        expOccurredNames(exp.type),
        expOccurredNames(exp.instance),
      ])
    }

    case "MatchExp": {
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
