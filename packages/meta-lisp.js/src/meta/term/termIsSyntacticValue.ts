import * as M from "../index.ts"

export function termIsSyntacticValue(term: M.Term): boolean {
  switch (term.kind) {
    case "SymbolTerm":
    case "KeywordTerm":
    case "StringTerm":
    case "IntTerm":
    case "FloatTerm":
    case "VarTerm":
    case "QualifiedVarTerm":
    case "LambdaTerm":
      return true

    case "TheTerm":
      return termIsSyntacticValue(term.instance)

    default:
      return false
  }
}
