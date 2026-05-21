import * as M from "../index.ts"
import type { Term } from "./Term.ts"

export function termToExp(term: Term): M.Exp {
  switch (term.kind) {
    case "SymbolTerm":
      return M.SymbolExp(term.content, term.location)
    case "KeywordTerm":
      return M.KeywordExp(term.content, term.location)
    case "StringTerm":
      return M.StringExp(term.content, term.location)
    case "IntTerm":
      return M.IntExp(term.content, term.location)
    case "FloatTerm":
      return M.FloatExp(term.content, term.location)
    case "VarTerm":
      return M.VarExp(term.name, term.location)
    case "QualifiedVarTerm":
      return M.QualifiedVarExp(term.modName, term.name, term.location)
    case "LambdaTerm":
      return M.LambdaExp(term.parameters, termToExp(term.body), term.location)
    case "ApplyTerm":
      return M.ApplyExp(
        termToExp(term.target),
        term.args.map(termToExp),
        term.location,
      )
    case "Let1Term":
      return M.Let1Exp(
        term.name,
        termToExp(term.rhs),
        termToExp(term.body),
        term.location,
      )
    case "Begin1Term":
      return M.Begin1Exp(
        termToExp(term.head),
        termToExp(term.body),
        term.location,
      )
    case "IfTerm":
      return M.IfExp(
        termToExp(term.condition),
        termToExp(term.consequent),
        termToExp(term.alternative),
        term.location,
      )
    case "ArrowTerm":
      return M.ArrowExp(
        term.argTypes.map(termToExp),
        termToExp(term.retType),
        term.location,
      )
    case "TheTerm":
      return M.TheExp(termToExp(term.type), termToExp(term.exp), term.location)
    case "PolymorphicTerm":
      return M.PolymorphicExp(
        term.parameters,
        termToExp(term.body),
        term.location,
      )
  }
}
