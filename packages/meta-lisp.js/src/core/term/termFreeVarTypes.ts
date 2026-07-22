import * as M from "../../meta/index.ts"
import { type Term } from "./Term.ts"

export function termFreeVarTypes(
  boundNames: Set<string>,
  term: Term,
): Map<string, M.Type> {
  switch (term.kind) {
    case "SymbolTerm":
    case "KeywordTerm":
    case "StringTerm":
    case "IntTerm":
    case "FloatTerm":
    case "QualifiedVarTerm": {
      return new Map()
    }

    case "VarTerm": {
      if (boundNames.has(term.name)) {
        return new Map()
      } else {
        const map = new Map<string, M.Type>()
        map.set(term.name, term.type)
        return map
      }
    }

    case "LambdaTerm": {
      return termFreeVarTypes(
        new Set([...boundNames, ...term.parameters]),
        term.body,
      )
    }

    case "ApplyTerm": {
      return mergeFreeVarTypeMaps([
        termFreeVarTypes(boundNames, term.target),
        ...term.args.map((a) => termFreeVarTypes(boundNames, a)),
      ])
    }

    case "Let1Term": {
      return mergeFreeVarTypeMaps([
        termFreeVarTypes(boundNames, term.rhs),
        termFreeVarTypes(new Set([...boundNames, term.name]), term.body),
      ])
    }

    case "Begin1Term": {
      return mergeFreeVarTypeMaps([
        termFreeVarTypes(boundNames, term.head),
        termFreeVarTypes(boundNames, term.body),
      ])
    }

    case "IfTerm": {
      return mergeFreeVarTypeMaps([
        termFreeVarTypes(boundNames, term.condition),
        termFreeVarTypes(boundNames, term.consequent),
        termFreeVarTypes(boundNames, term.alternative),
      ])
    }
  }
}

function mergeFreeVarTypeMaps(
  maps: Array<Map<string, M.Type>>,
): Map<string, M.Type> {
  const result = new Map<string, M.Type>()
  for (const map of maps) {
    for (const [key, value] of map) {
      if (!result.has(key)) {
        result.set(key, value)
      }
    }
  }
  return result
}
