import * as Ppml from "@xieyuheng/ppml.js"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function prettyExp(exp: M.Exp): Ppml.Node {
  switch (exp.kind) {
    case "KeywordExp": {
      return Ppml.text(`:${exp.content}`)
    }

    case "SymbolExp": {
      return Ppml.text(`'${exp.content}`)
    }

    case "StringExp": {
      return Ppml.text(JSON.stringify(exp.content))
    }

    case "IntExp": {
      return Ppml.text(exp.content.toString())
    }

    case "FloatExp": {
      if (Number.isInteger(exp.content)) {
        return Ppml.text(`${exp.content.toString()}.0`)
      } else {
        return Ppml.text(exp.content.toString())
      }
    }

    case "VarExp": {
      return Ppml.text(exp.name)
    }

    case "QualifiedVarExp": {
      return Ppml.text(`${exp.pkgName}/${exp.modName}/${exp.name}`)
    }

    case "LambdaExp": {
      const paramsNode = Ppml.prettyApplication(exp.parameters.map(Ppml.text))
      return Ppml.prettySyntax("lambda", [paramsNode], prettyBody(exp.body))
    }

    case "PolymorphicExp": {
      const paramsNode = Ppml.prettyApplication(exp.parameters.map(Ppml.text))
      return Ppml.prettySyntax(
        "polymorphic",
        [paramsNode],
        [prettyExp(exp.body)],
      )
    }

    case "ApplyExp": {
      const target = prettyExp(exp.target)
      const args = exp.args.map(prettyExp)
      return Ppml.prettyApplication([target, ...args])
    }

    case "PipeExp": {
      const target = prettyExp(exp.target)
      const steps = exp.steps.map(prettyExp)
      return Ppml.prettySyntax("pipe", [target], steps)
    }

    case "ChainExp": {
      const steps = exp.steps.map(prettyExp)
      return Ppml.prettySyntax("chain", [], steps)
    }

    case "ComposeExp": {
      const steps = exp.steps.map(prettyExp)
      return Ppml.prettySyntax("compose", [], steps)
    }

    case "Let1Exp": {
      const assignNode = Ppml.group(
        Ppml.text("("),
        Ppml.text("="),
        Ppml.br(),
        Ppml.text(exp.name),
        Ppml.br(),
        prettyExp(exp.rhs),
        Ppml.text(")"),
      )
      return Ppml.prettySyntax(
        "begin",
        [],
        [assignNode, ...prettyBody(exp.body)],
      )
    }

    case "LetExp": {
      return Ppml.prettySyntax(
        "let",
        [prettyBindings(exp.bindings)],
        prettyBody(exp.body),
      )
    }

    case "LetStarExp": {
      return Ppml.prettySyntax(
        "let*",
        [prettyBindings(exp.bindings)],
        prettyBody(exp.body),
      )
    }

    case "LetrecExp": {
      return Ppml.prettySyntax(
        "letrec",
        [prettyBindings(exp.bindings)],
        prettyBody(exp.body),
      )
    }

    case "LetrecStarExp": {
      return Ppml.prettySyntax(
        "letrec*",
        [prettyBindings(exp.bindings)],
        prettyBody(exp.body),
      )
    }

    case "LocalDefineExp": {
      if (exp.parameters.length > 0) {
        const paramNodes = exp.parameters.map(Ppml.text)
        const defNode = Ppml.prettyApplication([
          Ppml.text(exp.name),
          ...paramNodes,
        ])
        return Ppml.prettySyntax("define", [defNode], prettyBody(exp.body))
      } else {
        return Ppml.prettySyntax(
          "define",
          [Ppml.text(exp.name)],
          prettyBody(exp.body),
        )
      }
    }

    case "Begin1Exp": {
      return Ppml.prettySyntax(
        "begin",
        [],
        [prettyExp(exp.head), ...prettyBody(exp.body)],
      )
    }

    case "BeginExp": {
      return Ppml.prettySyntax("begin", [], exp.sequence.map(prettyExp))
    }

    case "AssignExp": {
      return Ppml.prettySyntax(
        "=",
        [],
        [Ppml.text(exp.name), prettyExp(exp.rhs)],
      )
    }

    case "IfExp": {
      return Ppml.prettySyntax(
        "if",
        [
          prettyExp(exp.condition),
          prettyExp(exp.consequent),
          prettyExp(exp.alternative),
        ],
        [],
      )
    }

    case "WhenExp": {
      return Ppml.prettySyntax(
        "when",
        [prettyExp(exp.condition), prettyExp(exp.consequent)],
        [],
      )
    }

    case "UnlessExp": {
      return Ppml.prettySyntax(
        "unless",
        [prettyExp(exp.condition), prettyExp(exp.alternative)],
        [],
      )
    }

    case "AndExp": {
      return Ppml.prettyApplication([
        Ppml.text("and"),
        ...exp.exps.map(prettyExp),
      ])
    }

    case "OrExp": {
      return Ppml.prettyApplication([
        Ppml.text("or"),
        ...exp.exps.map(prettyExp),
      ])
    }

    case "CondExp": {
      return Ppml.prettySyntax("cond", [], exp.clauses.map(prettyCondClause))
    }

    case "ListExp": {
      return Ppml.prettySyntax("@list", [], exp.elements.map(prettyExp))
    }

    case "StringConcatExp": {
      return Ppml.prettySyntax("@string", [], exp.elements.map(prettyExp))
    }

    case "SetExp": {
      return Ppml.prettySyntax("@set", [], exp.elements.map(prettyExp))
    }

    case "HashExp": {
      const entryNodes: Array<Ppml.Node> = []
      for (const { key, value } of exp.entries) {
        entryNodes.push(prettyExp(key), prettyExp(value))
      }
      return Ppml.prettySyntax("@hash", [], entryNodes)
    }

    case "QuoteExp": {
      return Ppml.concat(Ppml.text("'"), Ppml.text(S.formatSexp(exp.sexp)))
    }

    case "SexpExp": {
      return Ppml.prettySyntax("@sexp", [], [Ppml.text(S.formatSexp(exp.sexp))])
    }

    case "ArrowExp": {
      return Ppml.prettyApplication([
        Ppml.text("->"),
        ...exp.argTypes.map(prettyExp),
        prettyExp(exp.retType),
      ])
    }

    case "TheExp": {
      return Ppml.prettySyntax(
        "the",
        [prettyExp(exp.type), prettyExp(exp.instance)],
        [],
      )
    }

    case "CommentExp": {
      return Ppml.prettySyntax(
        "@comment",
        [],
        exp.sexps.map((s) => Ppml.text(S.formatSexp(s))),
      )
    }

    case "MatchExp": {
      const clauses = exp.clauses.map(prettyMatchClause)
      if (exp.targets.length === 1) {
        return Ppml.prettySyntax("match", [prettyExp(exp.targets[0])], clauses)
      } else {
        const targetsNode = Ppml.prettyApplication(exp.targets.map(prettyExp))
        return Ppml.prettySyntax("match-many", [targetsNode], clauses)
      }
    }
  }
}

export function prettyExps(exps: Array<M.Exp>): Array<Ppml.Node> {
  return exps.map(prettyExp)
}

export function prettyParameters(parameters: Array<string>): Array<Ppml.Node> {
  return parameters.map(Ppml.text)
}

export function prettyBinding(binding: M.Binding): Ppml.Node {
  return Ppml.prettyApplication([
    Ppml.text(binding.name),
    prettyExp(binding.rhs),
  ])
}

function prettyBindings(bindings: Array<M.Binding>): Ppml.Node {
  return Ppml.prettyApplication(bindings.map(prettyBinding))
}

export function prettyCondClause(clause: M.CondClause): Ppml.Node {
  return Ppml.prettyApplication([
    prettyExp(clause.question),
    prettyExp(clause.answer),
  ])
}

export function prettyMatchClauses(
  clauses: Array<M.MatchClause>,
): Array<Ppml.Node> {
  return clauses.map(prettyMatchClause)
}

export function prettyMatchClause(clause: M.MatchClause): Ppml.Node {
  const body = prettyBody(clause.body)
  if (clause.patterns.length === 1) {
    return Ppml.prettyApplication([prettyExp(clause.patterns[0]), ...body])
  } else {
    const patternsNode = Ppml.prettyApplication(clause.patterns.map(prettyExp))
    return Ppml.prettyApplication([patternsNode, ...body])
  }
}

export function prettyBody(body: M.Exp): Array<Ppml.Node> {
  if (body.kind === "Begin1Exp") {
    return [prettyExp(body.head), ...prettyBody(body.body)]
  } else if (body.kind === "Let1Exp") {
    const assignNode = Ppml.group(
      Ppml.text("("),
      Ppml.text("="),
      Ppml.br(),
      Ppml.text(body.name),
      Ppml.br(),
      prettyExp(body.rhs),
      Ppml.text(")"),
    )
    return [assignNode, ...prettyBody(body.body)]
  } else if (body.kind === "BeginExp") {
    return body.sequence.map(prettyExp)
  } else {
    return [prettyExp(body)]
  }
}

export function prettyTerm(term: M.Term): Ppml.Node {
  switch (term.kind) {
    case "SymbolTerm": {
      return Ppml.text(term.content)
    }

    case "KeywordTerm": {
      return Ppml.text(`:${term.content}`)
    }

    case "StringTerm": {
      return Ppml.text(JSON.stringify(term.content))
    }

    case "IntTerm": {
      return Ppml.text(`${term.content}`)
    }

    case "FloatTerm": {
      return Ppml.text(`${term.content}`)
    }

    case "VarTerm": {
      return Ppml.text(term.name)
    }

    case "QualifiedVarTerm": {
      return Ppml.text(`${term.pkgName}/${term.modName}/${term.name}`)
    }

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
        Ppml.br(),
        Ppml.text(term.name),
        Ppml.br(),
        prettyTerm(term.rhs),
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
        [
          prettyTerm(term.condition),
          prettyTerm(term.consequent),
          prettyTerm(term.alternative),
        ],
        [],
      )
    }

    case "ArrowTerm": {
      return Ppml.prettyApplication([
        Ppml.text("->"),
        ...term.argTypes.map(prettyTerm),
        prettyTerm(term.retType),
      ])
    }

    case "TheTerm": {
      return Ppml.prettySyntax(
        "the",
        [prettyTerm(term.type), prettyTerm(term.instance)],
        [],
      )
    }

    case "PolymorphicTerm": {
      const paramsNode = Ppml.prettyApplication(term.parameters.map(Ppml.text))
      return Ppml.prettySyntax(
        "polymorphic",
        [paramsNode],
        [prettyTerm(term.body)],
      )
    }
  }
}

export function prettyTermBody(body: M.Term): Array<Ppml.Node> {
  if (body.kind === "Begin1Term") {
    return [prettyTerm(body.head), ...prettyTermBody(body.body)]
  } else if (body.kind === "Let1Term") {
    const assignNode = Ppml.group(
      Ppml.text("("),
      Ppml.text("="),
      Ppml.br(),
      Ppml.text(body.name),
      Ppml.br(),
      prettyTerm(body.rhs),
      Ppml.text(")"),
    )
    return [assignNode, ...prettyTermBody(body.body)]
  } else {
    return [prettyTerm(body)]
  }
}
