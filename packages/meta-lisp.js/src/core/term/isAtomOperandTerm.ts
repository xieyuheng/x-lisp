import { type Term } from "./Term.ts"
import { isAtomTerm } from "./isAtomTerm.ts"

export function isAtomOperandTerm(term: Term): boolean {
  switch (term.kind) {
    case "SymbolTerm":
    case "KeywordTerm":
    case "StringTerm":
    case "IntTerm":
    case "FloatTerm":
    case "VarTerm":
    case "QualifiedVarTerm": {
      return true
    }

    case "LambdaTerm": {
      return isAtomOperandTerm(term.body)
    }

    case "ApplyTerm": {
      return isAtomTerm(term.target) && term.args.every(isAtomTerm)
    }

    case "Let1Term": {
      return isAtomOperandTerm(term.rhs) && isAtomOperandTerm(term.body)
    }

    case "Begin1Term": {
      return isAtomOperandTerm(term.head) && isAtomOperandTerm(term.body)
    }

    case "IfTerm": {
      return (
        isAtomOperandTerm(term.condition) &&
        isAtomOperandTerm(term.consequent) &&
        isAtomOperandTerm(term.alternative)
      )
    }

    case "ClosureTerm": {
      return true
    }
  }
}
