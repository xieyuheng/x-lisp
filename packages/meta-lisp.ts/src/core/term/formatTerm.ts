import { type Term } from "./Term.ts"

export function formatTerm(term: Term): string {
  switch (term.kind) {
    case "SymbolTerm":
      return term.content

    case "StringTerm":
      return JSON.stringify(term.content)

    case "IntTerm":
      return `${term.content}`

    case "FloatTerm":
      if (Number.isInteger(term.content)) {
        return `${term.content}.0`
      } else {
        return `${term.content}`
      }

    case "VarTerm":
      return term.name

    case "QualifiedVarTerm":
      return `${term.pkgName}/${term.modName}/${term.name}`

    case "LambdaTerm":
      return `(lambda (${term.parameters.join(" ")}) ${formatTerm(term.body)})`

    case "ApplyTerm":
      if (term.args.length === 0) {
        return `(${formatTerm(term.target)})`
      }
      return `(${formatTerm(term.target)} ${term.args.map(formatTerm).join(" ")})`

    case "Let1Term":
      return `(let ((${term.name} ${formatTerm(term.rhs)})) ${formatTerm(term.body)})`

    case "Begin1Term":
      return `(begin ${formatTerm(term.head)} ${formatTerm(term.body)})`

    case "IfTerm":
      return `(if ${formatTerm(term.condition)} ${formatTerm(term.consequent)} ${formatTerm(term.alternative)})`

    case "ClosureTerm":
      return `(@closure ${term.pkgName}/${term.modName}/${term.name} ${term.args.map(formatTerm).join(" ")})`
  }
}
