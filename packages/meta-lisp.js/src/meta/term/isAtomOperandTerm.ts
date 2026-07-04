import * as M from "../index.ts"

export function isAtomOperandTerm(term: M.Term): boolean {
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
      return isAtomOperandTerm(term.target) && term.args.every(M.isAtomTerm)
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

    case "ArrowTerm": {
      return (
        term.argTypes.every(isAtomOperandTerm) &&
        isAtomOperandTerm(term.retType)
      )
    }

    case "TheTerm": {
      return isAtomOperandTerm(term.type) && isAtomOperandTerm(term.instance)
    }

    case "PolymorphicTerm": {
      return isAtomOperandTerm(term.body)
    }
  }
}
