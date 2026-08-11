import * as Ppml from "@xieyuheng/ppml.js"
import { type Term } from "../term/Term.ts"

export function prettyTerm(term: Term): Ppml.Node {
  switch (term.kind) {
    case "SymbolTerm":
      return Ppml.text(term.content)

    case "StringTerm":
      return Ppml.text(JSON.stringify(term.content))

    case "IntTerm":
      return Ppml.text(`${term.content}`)

    case "FloatTerm":
      if (Number.isInteger(term.content)) {
        return Ppml.text(`${term.content}.0`)
      } else {
        return Ppml.text(`${term.content}`)
      }

    case "VarTerm":
      return Ppml.text(term.name)

    case "QualifiedVarTerm":
      return Ppml.text(`${term.pkgName}/${term.modName}/${term.name}`)

    case "LambdaTerm": {
      const paramsNode = Ppml.prettyApplication(term.parameters.map(Ppml.text))
      return Ppml.prettySyntax("lambda", [paramsNode], [prettyTerm(term.body)])
    }

    case "ApplyTerm": {
      const target = prettyTerm(term.target)
      const args = term.args.map(prettyTerm)
      return Ppml.prettyApplication([target, ...args])
    }

    case "Let1Term": {
      const binding = Ppml.prettyApplication([
        Ppml.text(term.name),
        prettyTerm(term.rhs),
      ])
      return Ppml.prettySyntax(
        "let",
        [Ppml.prettyApplication([binding])],
        [prettyTerm(term.body)],
      )
    }

    case "Begin1Term": {
      return Ppml.prettySyntax(
        "begin",
        [],
        [prettyTerm(term.head), prettyTerm(term.body)],
      )
    }

    case "IfTerm": {
      return Ppml.prettySyntax(
        "if",
        [prettyTerm(term.condition)],
        [prettyTerm(term.consequent), prettyTerm(term.alternative)],
      )
    }

    case "ClosureTerm": {
      return Ppml.prettySyntax(
        "@closure",
        [Ppml.text(`${term.pkgName}/${term.modName}/${term.name}`)],
        term.args.map(prettyTerm),
      )
    }
  }
}
