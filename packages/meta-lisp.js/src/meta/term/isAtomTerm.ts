import * as M from "../index.ts"

export function isAtomTerm(term: M.Term): boolean {
  switch (term.kind) {
    case "SymbolTerm":
    case "StringTerm":
    case "IntTerm":
    case "FloatTerm":
    case "VarTerm":
    case "QualifiedVarTerm": {
      return true
    }

    case "LambdaTerm":
    case "ApplyTerm":
    case "Let1Term":
    case "Begin1Term":
    case "IfTerm":
    case "ArrowTerm":
    case "TheTerm":
    case "AllTerm": {
      return false
    }
  }
}
