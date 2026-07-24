import * as Ppml from "@xieyuheng/ppml.js"
import { type Term } from "../term/Term.ts"

export function prettyTerm(term: Term): Ppml.Node {
  switch (term.kind) {
    case "SymbolTerm":
      return Ppml.text(term.content)

    case "KeywordTerm":
      return Ppml.text(`:${term.content}`)

    case "StringTerm":
      return Ppml.text(JSON.stringify(term.content))

    case "IntTerm":
      return Ppml.text(`${term.content}`)

    case "FloatTerm":
      return Ppml.text(`${term.content}`)

    case "VarTerm":
      return Ppml.text(term.name)

    case "QualifiedVarTerm":
      return Ppml.text(`${term.pkgName}/${term.modName}/${term.name}`)

    case "LambdaTerm": {
      const paramsNode = Ppml.prettyApplication(term.parameters.map(Ppml.text))
      return Ppml.prettySyntax(
        "lambda",
        [paramsNode],
        prettyTermBody(term.body),
      )
    }

    case "ApplyTerm": {
      const target = prettyTerm(term.target)
      const args = term.args.map(prettyTerm)
      return Ppml.prettyApplication([target, ...args])
    }

    case "Let1Term": {
      const assignNode = Ppml.group(
        Ppml.text("("),
        Ppml.text("="),
        Ppml.text(" "),
        Ppml.text(term.name),
        Ppml.indent(3, Ppml.br(), prettyTerm(term.rhs)),
        Ppml.text(")"),
      )
      return Ppml.prettySyntax(
        "begin",
        [],
        [assignNode, ...prettyTermBody(term.body)],
      )
    }

    case "Begin1Term": {
      return Ppml.prettySyntax(
        "begin",
        [],
        [prettyTerm(term.head), ...prettyTermBody(term.body)],
      )
    }

    case "IfTerm": {
      return Ppml.prettySyntax(
        "if",
        [prettyTerm(term.condition)],
        [prettyTerm(term.consequent), prettyTerm(term.alternative)],
      )
    }
  }
}

export function prettyTermBody(body: Term): Array<Ppml.Node> {
  if (body.kind === "Begin1Term") {
    return [prettyTerm(body.head), ...prettyTermBody(body.body)]
  } else if (body.kind === "Let1Term") {
    const assignNode = Ppml.group(
      Ppml.text("("),
      Ppml.text("="),
      Ppml.text(" "),
      Ppml.text(body.name),
      Ppml.indent(3, Ppml.br(), prettyTerm(body.rhs)),
      Ppml.text(")"),
    )
    return [assignNode, ...prettyTermBody(body.body)]
  } else {
    return [prettyTerm(body)]
  }
}
