import * as M from "./index.ts"

export function expIsCore(exp: M.Exp): boolean {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "Var":
    case "QualifiedVar":
      return true
    case "Lambda":
      return expIsCore(exp.body)
    case "Apply":
      return expIsCore(exp.target) && exp.args.every((arg) => expIsCore(arg))
    case "Let1":
      return expIsCore(exp.rhs) && expIsCore(exp.body)
    case "Begin1":
      return expIsCore(exp.head) && expIsCore(exp.body)
    case "If":
      return (
        expIsCore(exp.condition) &&
        expIsCore(exp.consequent) &&
        expIsCore(exp.alternative)
      )
    case "Arrow":
      return exp.argTypes.every((t) => expIsCore(t)) && expIsCore(exp.retType)
    case "The":
      return expIsCore(exp.type) && expIsCore(exp.exp)
    case "Polymorphic":
      return expIsCore(exp.body)
    case "Match":
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
