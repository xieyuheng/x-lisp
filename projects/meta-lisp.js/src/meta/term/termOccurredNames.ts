import { setUnionMany } from "@xieyuheng/helpers.js/set"
import type { Term } from "./Term.ts"

export function termOccurredNames(term: Term): Set<string> {
  switch (term.kind) {
    case "SymbolTerm":
    case "KeywordTerm":
    case "StringTerm":
    case "IntTerm":
    case "FloatTerm": {
      return new Set()
    }

    case "VarTerm": {
      return new Set([term.name])
    }

    case "QualifiedVarTerm": {
      return new Set()
    }

    case "LambdaTerm": {
      return setUnionMany([
        new Set(term.parameters),
        termOccurredNames(term.body),
      ])
    }

    case "PolymorphicTerm": {
      return setUnionMany([
        new Set(term.parameters),
        termOccurredNames(term.body),
      ])
    }

    case "ApplyTerm": {
      return setUnionMany([
        termOccurredNames(term.target),
        ...term.args.map(termOccurredNames),
      ])
    }

    case "Let1Term": {
      return setUnionMany([
        new Set([term.name]),
        termOccurredNames(term.rhs),
        termOccurredNames(term.body),
      ])
    }

    case "Begin1Term": {
      return setUnionMany([
        termOccurredNames(term.head),
        termOccurredNames(term.body),
      ])
    }

    case "IfTerm": {
      return setUnionMany([
        termOccurredNames(term.condition),
        termOccurredNames(term.consequent),
        termOccurredNames(term.alternative),
      ])
    }

    case "ArrowTerm": {
      return setUnionMany([
        ...term.argTypes.map(termOccurredNames),
        termOccurredNames(term.retType),
      ])
    }

    case "TheTerm": {
      return setUnionMany([
        termOccurredNames(term.type),
        termOccurredNames(term.exp),
      ])
    }
  }
}
