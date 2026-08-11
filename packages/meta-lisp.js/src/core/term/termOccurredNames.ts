import { setUnion, setUnionMany } from "@xieyuheng/std.js/set"
import { type Term } from "./Term.ts"

export function termOccurredNames(term: Term): Set<string> {
  switch (term.kind) {
    case "SymbolTerm":
    case "StringTerm":
    case "IntTerm":
    case "FloatTerm":
    case "QualifiedVarTerm": {
      return new Set()
    }

    case "VarTerm": {
      return new Set([term.name])
    }

    case "LambdaTerm": {
      return setUnionMany([
        new Set(term.parameters),
        termOccurredNames(term.body),
      ])
    }

    case "ApplyTerm": {
      return setUnion(
        termOccurredNames(term.target),
        setUnionMany(term.args.map(termOccurredNames)),
      )
    }

    case "Let1Term": {
      return setUnionMany([
        new Set([term.name]),
        termOccurredNames(term.rhs),
        termOccurredNames(term.body),
      ])
    }

    case "Begin1Term": {
      return setUnion(
        termOccurredNames(term.head),
        termOccurredNames(term.body),
      )
    }

    case "IfTerm": {
      return setUnionMany([
        termOccurredNames(term.condition),
        termOccurredNames(term.consequent),
        termOccurredNames(term.alternative),
      ])
    }

    case "ClosureTerm": {
      return setUnionMany(term.args.map(termOccurredNames))
    }
  }
}
