import * as M from "../index.ts"
import type { Term } from "./Term.ts"

// Like `termSubst` but without capture avoidance.
// Stops at a binding when the bound name equals `name` (shadowing).
// Does NOT alpha-rename, even when free names in `rhs` would be captured.

export function termNaiveSubst(
  term: Term,
  name: string,
  replacement: Term,
): Term {
  switch (term.kind) {
    case "SymbolTerm":
    case "KeywordTerm":
    case "StringTerm":
    case "IntTerm":
    case "FloatTerm": {
      return term
    }

    case "VarTerm": {
      if (term.name === name) return replacement
      return term
    }

    case "QualifiedVarTerm": {
      return term
    }

    case "LambdaTerm": {
      if (term.parameters.includes(name)) return term
      return M.LambdaTerm(
        term.parameters,
        termNaiveSubst(term.body, name, replacement),
        term.location,
      )
    }

    case "PolymorphicTerm": {
      if (term.parameters.includes(name)) return term
      return M.PolymorphicTerm(
        term.parameters,
        termNaiveSubst(term.body, name, replacement),
        term.location,
      )
    }

    case "ApplyTerm": {
      return M.ApplyTerm(
        termNaiveSubst(term.target, name, replacement),
        term.args.map((a) => termNaiveSubst(a, name, replacement)),
        term.location,
      )
    }

    case "Let1Term": {
      const newRHS = termNaiveSubst(term.rhs, name, replacement)
      const newBody =
        term.name === name
          ? term.body
          : termNaiveSubst(term.body, name, replacement)
      return M.Let1Term(term.name, newRHS, newBody, term.location)
    }

    case "Begin1Term": {
      return M.Begin1Term(
        termNaiveSubst(term.head, name, replacement),
        termNaiveSubst(term.body, name, replacement),
        term.location,
      )
    }

    case "IfTerm": {
      return M.IfTerm(
        termNaiveSubst(term.condition, name, replacement),
        termNaiveSubst(term.consequent, name, replacement),
        termNaiveSubst(term.alternative, name, replacement),
        term.location,
      )
    }

    case "ArrowTerm": {
      return M.ArrowTerm(
        term.argTypes.map((t) => termNaiveSubst(t, name, replacement)),
        termNaiveSubst(term.retType, name, replacement),
        term.location,
      )
    }

    case "TheTerm": {
      return M.TheTerm(
        termNaiveSubst(term.type, name, replacement),
        termNaiveSubst(term.exp, name, replacement),
        term.location,
      )
    }
  }
}
