import { setUnionMany } from "@xieyuheng/std.js/set"
import { type Term } from "./Term.ts"

export function termFreeNames(
  boundNames: Set<string>,
  term: Term,
): Set<string> {
  switch (term.kind) {
    case "SymbolTerm":
    case "KeywordTerm":
    case "StringTerm":
    case "IntTerm":
    case "FloatTerm": {
      return new Set()
    }

    case "VarTerm": {
      return boundNames.has(term.name) ? new Set() : new Set([term.name])
    }

    case "QualifiedVarTerm": {
      return new Set()
    }

    case "LambdaTerm": {
      return termFreeNames(
        new Set([...boundNames, ...term.parameters]),
        term.body,
      )
    }

    case "ApplyTerm": {
      return setUnionMany([
        termFreeNames(boundNames, term.target),
        ...term.args.map((a) => termFreeNames(boundNames, a)),
      ])
    }

    case "Let1Term": {
      return setUnionMany([
        termFreeNames(boundNames, term.rhs),
        termFreeNames(new Set([...boundNames, term.name]), term.body),
      ])
    }

    case "Begin1Term": {
      return setUnionMany([
        termFreeNames(boundNames, term.head),
        termFreeNames(boundNames, term.body),
      ])
    }

    case "IfTerm": {
      return setUnionMany([
        termFreeNames(boundNames, term.condition),
        termFreeNames(boundNames, term.consequent),
        termFreeNames(boundNames, term.alternative),
      ])
    }
  }
}
