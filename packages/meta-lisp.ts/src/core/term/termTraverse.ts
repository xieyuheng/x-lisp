import {
  ApplyTerm,
  Begin1Term,
  ClosureTerm,
  IfTerm,
  LambdaTerm,
  Let1Term,
  type Term,
} from "./Term.ts"

export function termTraverse(onTerm: (term: Term) => Term, term: Term): Term {
  switch (term.kind) {
    case "VarTerm":
    case "QualifiedVarTerm":
    case "IntTerm":
    case "FloatTerm":
    case "StringTerm":
    case "SymbolTerm": {
      return term
    }

    case "LambdaTerm": {
      return LambdaTerm(term.parameters, onTerm(term.body), term.location)
    }

    case "ApplyTerm": {
      return ApplyTerm(
        onTerm(term.target),
        term.args.map((e) => onTerm(e)),
        term.location,
      )
    }

    case "Let1Term": {
      return Let1Term(
        term.name,
        onTerm(term.rhs),
        onTerm(term.body),
        term.location,
      )
    }

    case "Begin1Term": {
      return Begin1Term(onTerm(term.head), onTerm(term.body), term.location)
    }

    case "IfTerm": {
      return IfTerm(
        onTerm(term.condition),
        onTerm(term.consequent),
        onTerm(term.alternative),
        term.location,
      )
    }

    case "ClosureTerm": {
      return ClosureTerm(
        term.pkgName,
        term.modName,
        term.name,
        term.args.map(onTerm),
        term.location,
      )
    }
  }
}
