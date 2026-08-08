import { setUnion, setUnionMany } from "@xieyuheng/std.js/set"
import * as M from "../index.ts"

export function termOccurredNames(term: M.Term): Set<string> {
  switch (term.kind) {
    case "SymbolTerm":
    case "KeywordTerm":
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

    case "AllTerm": {
      return setUnionMany([
        new Set(term.parameters),
        termOccurredNames(term.body),
      ])
    }

    case "Let1Term": {
      return setUnionMany([
        new Set([term.name]),
        termOccurredNames(term.rhs),
        termOccurredNames(term.body),
      ])
    }

    case "ApplyTerm": {
      return setUnion(
        termOccurredNames(term.target),
        setUnionMany(term.args.map(termOccurredNames)),
      )
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

    case "ArrowTerm": {
      return setUnionMany([
        ...term.argTypes.map((t) => termOccurredNames(t)),
        termOccurredNames(term.retType),
      ])
    }

    case "TheTerm": {
      return setUnion(
        termOccurredNames(term.type),
        termOccurredNames(term.instance),
      )
    }
  }
}
