import { type Term } from "./Term.ts"

export function isAtomTerm(term: Term): boolean {
  switch (term.kind) {
    case "SymbolTerm":
    case "KeywordTerm":
    case "StringTerm":
    case "IntTerm":
    case "FloatTerm":
    case "VarTerm":
    case "QualifiedVarTerm":
      return true

    case "LambdaTerm":
    case "ApplyTerm":
    case "Let1Term":
    case "Begin1Term":
    case "IfTerm":
    case "ClosureTerm":
      return false
  }
}
