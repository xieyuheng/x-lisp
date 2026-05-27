import * as Ppml from "@xieyuheng/ppml.js"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import {
  prettyApplication,
  prettyQuote,
  prettySet,
  prettySyntax,
  prettyText,
} from "./layout.ts"
import { sexpConfig } from "./sexpConfig.ts"

const keywordHeaderLength: Record<string, number> = {}
for (const [name, len] of sexpConfig.keywords) {
  keywordHeaderLength[name] = len
}

function getHeaderLength(name: string): number {
  return keywordHeaderLength[name] ?? 0
}

export function prettyExp(exp: M.Exp): Ppml.Node {
  switch (exp.kind) {
    case "KeywordExp": {
      return prettyText(`:${exp.content}`)
    }

    case "SymbolExp": {
      return prettyText(`'${exp.content}`)
    }

    case "StringExp": {
      return prettyText(JSON.stringify(exp.content))
    }

    case "IntExp": {
      return prettyText(exp.content.toString())
    }

    case "FloatExp": {
      if (Number.isInteger(exp.content)) {
        return prettyText(`${exp.content.toString()}.0`)
      } else {
        return prettyText(exp.content.toString())
      }
    }

    case "VarExp": {
      return prettyText(exp.name)
    }

    case "QualifiedVarExp": {
      return prettyText(`${exp.modName}/${exp.name}`)
    }

    case "LambdaExp": {
      const paramsNode = prettyApplication(exp.parameters.map(Ppml.text))
      return prettySyntax("lambda", [paramsNode], prettyBody(exp.body))
    }

    case "PolymorphicExp": {
      const paramsNode = prettyApplication(exp.parameters.map(Ppml.text))
      return prettySyntax("polymorphic", [paramsNode], [prettyExp(exp.body)])
    }

    case "ApplyExp": {
      const target = prettyExp(exp.target)
      const args = exp.args.map(prettyExp)
      return prettyApplication([target, ...args])
    }

    case "PipeExp": {
      const target = prettyExp(exp.target)
      const steps = exp.steps.map(prettyExp)
      return prettySyntax("pipe", [target], steps)
    }

    case "ChainExp": {
      const steps = exp.steps.map(prettyExp)
      return prettySyntax("chain", [], steps)
    }

    case "ComposeExp": {
      const steps = exp.steps.map(prettyExp)
      return prettySyntax("compose", [], steps)
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
      return prettySyntax("begin", [], [assignNode, ...prettyBody(exp.body)])
    }

    case "LetExp": {
      return prettySyntax(
        "let",
        [prettyBindings(exp.bindings)],
        prettyBody(exp.body),
      )
    }

    case "LetStarExp": {
      return prettySyntax(
        "let*",
        [prettyBindings(exp.bindings)],
        prettyBody(exp.body),
      )
    }

    case "LetrecExp": {
      return prettySyntax(
        "letrec",
        [prettyBindings(exp.bindings)],
        prettyBody(exp.body),
      )
    }

    case "LetrecStarExp": {
      return prettySyntax(
        "letrec*",
        [prettyBindings(exp.bindings)],
        prettyBody(exp.body),
      )
    }

    case "LocalDefineExp": {
      if (exp.parameters.length > 0) {
        const paramNodes = exp.parameters.map(Ppml.text)
        const defNode = prettyApplication([Ppml.text(exp.name), ...paramNodes])
        return prettySyntax("define", [defNode], prettyBody(exp.body))
      } else {
        return prettySyntax(
          "define",
          [prettyText(exp.name)],
          prettyBody(exp.body),
        )
      }
    }

    case "Begin1Exp": {
      return prettySyntax(
        "begin",
        [],
        [prettyExp(exp.head), ...prettyBody(exp.body)],
      )
    }

    case "BeginExp": {
      return prettySyntax("begin", [], exp.sequence.map(prettyExp))
    }

    case "AssignExp": {
      return prettySyntax("=", [], [prettyText(exp.name), prettyExp(exp.rhs)])
    }

    case "IfExp": {
      return prettySyntax(
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
      return prettySyntax(
        "when",
        [prettyExp(exp.condition), prettyExp(exp.consequent)],
        [],
      )
    }

    case "UnlessExp": {
      return prettySyntax(
        "unless",
        [prettyExp(exp.condition), prettyExp(exp.alternative)],
        [],
      )
    }

    case "AndExp": {
      return prettyApplication([prettyText("and"), ...exp.exps.map(prettyExp)])
    }

    case "OrExp": {
      return prettyApplication([prettyText("or"), ...exp.exps.map(prettyExp)])
    }

    case "CondExp": {
      return prettySyntax("cond", [], exp.clauses.map(prettyCondClause))
    }

    case "ListExp": {
      return prettySyntax("@list", [], exp.elements.map(prettyExp))
    }

    case "StringConcatExp": {
      return prettySyntax("@string", [], exp.elements.map(prettyExp))
    }

    case "SetExp": {
      return prettySet(exp.elements.map(prettyExp))
    }

    case "HashExp": {
      const entryNodes: Array<Ppml.Node> = []
      for (const { key, value } of exp.entries) {
        entryNodes.push(prettyExp(key), prettyExp(value))
      }
      return prettySyntax("@hash", [], entryNodes)
    }

    case "QuoteExp": {
      return prettyQuote(prettyText(S.formatSexp(exp.sexp)))
    }

    case "SexpExp": {
      return prettySyntax("@sexp", [], [prettyText(S.formatSexp(exp.sexp))])
    }

    case "ArrowExp": {
      return prettyApplication([
        prettyText("->"),
        ...exp.argTypes.map(prettyExp),
        prettyExp(exp.retType),
      ])
    }

    case "TheExp": {
      return prettySyntax(
        "the",
        [prettyExp(exp.type), prettyExp(exp.instance)],
        [],
      )
    }

    case "CommentExp": {
      return prettySyntax(
        "@comment",
        [],
        [prettyText(S.formatSexp(exp.content))],
      )
    }

    case "MatchExp": {
      const clauses = exp.clauses.map(prettyMatchClause)
      if (exp.targets.length === 1) {
        return prettySyntax("match", [prettyExp(exp.targets[0])], clauses)
      } else {
        const targetsNode = prettyApplication(exp.targets.map(prettyExp))
        return prettySyntax("match-many", [targetsNode], clauses)
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
  return prettyApplication([Ppml.text(binding.name), prettyExp(binding.rhs)])
}

function prettyBindings(bindings: Array<M.Binding>): Ppml.Node {
  return prettyApplication(bindings.map(prettyBinding))
}

export function prettyCondClause(clause: M.CondClause): Ppml.Node {
  return prettyApplication([
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
    return prettyApplication([prettyExp(clause.patterns[0]), ...body])
  } else {
    const patternsNode = prettyApplication(clause.patterns.map(prettyExp))
    return prettyApplication([patternsNode, ...body])
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
      return prettyText(term.content)
    }

    case "KeywordTerm": {
      return prettyText(`:${term.content}`)
    }

    case "StringTerm": {
      return prettyText(JSON.stringify(term.content))
    }

    case "IntTerm": {
      return prettyText(`${term.content}`)
    }

    case "FloatTerm": {
      return prettyText(`${term.content}`)
    }

    case "VarTerm": {
      return prettyText(term.name)
    }

    case "QualifiedVarTerm": {
      return prettyText(`${term.modName}.${term.name}`)
    }

    case "LambdaTerm": {
      const paramsNode = prettyApplication(term.parameters.map(Ppml.text))
      return prettySyntax("lambda", [paramsNode], prettyTermBody(term.body))
    }

    case "ApplyTerm": {
      const target = prettyTerm(term.target)
      const args = term.args.map(prettyTerm)
      return prettyApplication([target, ...args])
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
      return prettySyntax(
        "begin",
        [],
        [assignNode, ...prettyTermBody(term.body)],
      )
    }

    case "Begin1Term": {
      return prettySyntax(
        "begin",
        [],
        [prettyTerm(term.head), ...prettyTermBody(term.body)],
      )
    }

    case "IfTerm": {
      return prettySyntax(
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
      return prettyApplication([
        prettyText("->"),
        ...term.argTypes.map(prettyTerm),
        prettyTerm(term.retType),
      ])
    }

    case "TheTerm": {
      return prettySyntax(
        "the",
        [prettyTerm(term.type), prettyTerm(term.instance)],
        [],
      )
    }

    case "PolymorphicTerm": {
      const paramsNode = prettyApplication(term.parameters.map(Ppml.text))
      return prettySyntax("polymorphic", [paramsNode], [prettyTerm(term.body)])
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
