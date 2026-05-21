import * as M from "./index.ts"

export function expIsCore(exp: M.Exp): boolean {
  switch (exp.kind) {
    case "SymbolExp":
    case "KeywordExp":
    case "StringExp":
    case "IntExp":
    case "FloatExp":
    case "VarExp":
    case "QualifiedVarExp":
      return true
    case "LambdaExp":
      return expIsCore(exp.body)
    case "ApplyExp":
      return expIsCore(exp.target) && exp.args.every((arg) => expIsCore(arg))
    case "Let1Exp":
      return expIsCore(exp.rhs) && expIsCore(exp.body)
    case "Begin1Exp":
      return expIsCore(exp.head) && expIsCore(exp.body)
    case "IfExp":
      return (
        expIsCore(exp.condition) &&
        expIsCore(exp.consequent) &&
        expIsCore(exp.alternative)
      )
    case "ArrowExp":
      return exp.argTypes.every((t) => expIsCore(t)) && expIsCore(exp.retType)
    case "TheExp":
      return expIsCore(exp.type) && expIsCore(exp.exp)
    case "PolymorphicExp":
      return expIsCore(exp.body)
    case "MatchExp":
      return (
        exp.targets.every((target) => expIsCore(target)) &&
        exp.clauses.every(
          (clause) =>
            clause.patterns.every((p) => expIsCore(p)) &&
            expIsCore(clause.body),
        )
      )
    default:
      return false
  }
}
