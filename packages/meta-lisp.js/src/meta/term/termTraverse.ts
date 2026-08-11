import * as M from "../index.ts"
import type { Term } from "./Term.ts"

export function termTraverse(onTerm: (term: Term) => Term, term: Term): Term {
  switch (term.kind) {
    case "SymbolTerm":
    case "StringTerm":
    case "IntTerm":
    case "FloatTerm":
    case "VarTerm":
    case "QualifiedVarTerm": {
      return term
    }

    case "LambdaTerm": {
      return M.LambdaTerm(term.parameters, onTerm(term.body), term.location)
    }

    case "AllTerm": {
      return M.AllTerm(term.parameters, onTerm(term.body), term.location)
    }

    case "ApplyTerm": {
      return M.ApplyTerm(
        onTerm(term.target),
        term.args.map((e) => onTerm(e)),
        term.location,
      )
    }

    case "Let1Term": {
      return M.Let1Term(
        term.name,
        onTerm(term.rhs),
        onTerm(term.body),
        term.location,
      )
    }

    case "Begin1Term": {
      return M.Begin1Term(onTerm(term.head), onTerm(term.body), term.location)
    }

    case "IfTerm": {
      return M.IfTerm(
        onTerm(term.condition),
        onTerm(term.consequent),
        onTerm(term.alternative),
        term.location,
      )
    }

    case "ArrowTerm": {
      return M.ArrowTerm(
        term.argTypes.map(onTerm),
        onTerm(term.retType),
        term.location,
      )
    }

    case "TheTerm": {
      return M.TheTerm(onTerm(term.type), onTerm(term.instance), term.location)
    }
  }
}
