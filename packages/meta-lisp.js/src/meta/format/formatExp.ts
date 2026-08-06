import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function formatExps(exps: Array<M.Exp>): string {
  return exps.map(formatExp).join(" ")
}

export function formatExpAttributes(attributes: Record<string, M.Exp>): string {
  return Object.entries(attributes)
    .map(([k, e]) => `:${k} ${formatExp(e)}`)
    .join(" ")
}

export function formatParameters(parameters: Array<string>): string {
  return parameters.join(" ")
}

export function formatExp(exp: M.Exp): string {
  switch (exp.kind) {
    case "KeywordExp": {
      return `:${exp.content}`
    }

    case "SymbolExp": {
      return `'${exp.content}`
    }

    case "StringExp": {
      return JSON.stringify(exp.content)
    }

    case "IntExp": {
      return exp.content.toString()
    }

    case "FloatExp": {
      if (Number.isInteger(exp.content)) {
        return `${exp.content.toString()}.0`
      } else {
        return exp.content.toString()
      }
    }

    case "VarExp": {
      return exp.name
    }

    case "QualifiedVarExp": {
      return `${exp.pkgName}/${exp.modName}/${exp.name}`
    }

    case "LambdaExp": {
      const parameters = formatParameters(exp.parameters)
      const body = formatBody(exp.body)
      return `(lambda (${parameters}) ${body})`
    }

    case "PolymorphicExp": {
      const parameters = formatParameters(exp.parameters)
      const body = formatExp(exp.body)
      return `(polymorphic (${parameters}) ${body})`
    }

    case "ApplyExp": {
      const target = formatExp(exp.target)
      const args = formatExps(exp.args)
      if (args === "") {
        return `(${target})`
      } else {
        return `(${target} ${args})`
      }
    }

    case "PipeExp": {
      const target = formatExp(exp.target)
      const steps = formatExps(exp.steps)
      if (steps === "") {
        return `(pipe ${target})`
      } else {
        return `(pipe ${target} ${steps})`
      }
    }

    case "ChainExp": {
      const steps = formatExps(exp.steps)
      if (steps === "") {
        return `(chain)`
      } else {
        return `(chain ${steps})`
      }
    }

    case "ComposeExp": {
      const steps = formatExps(exp.steps)
      if (steps === "") {
        return `(compose)`
      } else {
        return `(compose ${steps})`
      }
    }

    case "Let1Exp": {
      const rhs = formatExp(exp.rhs)
      const body = formatBody(exp.body)
      return `(let ((${exp.name} ${rhs})) ${body})`
    }

    case "LetExp": {
      const bindings = exp.bindings.map(formatBinding).join(" ")
      const body = formatBody(exp.body)
      return `(let (${bindings}) ${body})`
    }

    case "LetrecExp": {
      const bindings = exp.bindings.map(formatBinding).join(" ")
      const body = formatBody(exp.body)
      return `(letrec (${bindings}) ${body})`
    }

    case "LocalDefineExp": {
      if (exp.parameters.length > 0) {
        const params = exp.parameters.join(" ")
        return `(define (${exp.name} ${params}) ${formatBody(exp.body)})`
      } else {
        return `(define ${exp.name} ${formatBody(exp.body)})`
      }
    }

    case "Begin1Exp": {
      const head = formatExp(exp.head)
      const body = formatBody(exp.body)
      return `(begin ${head} ${body})`
    }

    case "BeginExp": {
      const sequence = formatExps(exp.sequence)
      return `(begin ${sequence})`
    }

    case "IfExp": {
      return `(if ${formatExp(exp.condition)} ${formatExp(exp.consequent)} ${formatExp(exp.alternative)})`
    }

    case "WhenExp": {
      return `(when ${formatExp(exp.condition)} ${formatExp(exp.consequent)})`
    }

    case "UnlessExp": {
      return `(unless ${formatExp(exp.condition)} ${formatExp(exp.alternative)})`
    }

    case "AndExp": {
      const exps = formatExps(exp.exps)
      if (exps === "") {
        return `(and)`
      } else {
        return `(and ${exps})`
      }
    }

    case "OrExp": {
      const exps = formatExps(exp.exps)
      if (exps === "") {
        return `(or)`
      } else {
        return `(or ${exps})`
      }
    }

    case "CondExp": {
      const clauses = exp.clauses.map(formatCondClause)
      return `(cond ${clauses.join(" ")})`
    }

    case "ListExp": {
      const elements = formatExps(exp.elements)

      if (elements === "") {
        return `(@list)`
      } else {
        return `(@list ${elements})`
      }
    }

    case "StringConcatExp": {
      const elements = formatExps(exp.elements)
      if (elements === "") {
        return `(@text)`
      } else {
        return `(@text ${elements})`
      }
    }

    case "SetExp": {
      const elements = formatExps(exp.elements)
      return `(@set ${elements})`
    }

    case "HashExp": {
      const entries = exp.entries
        .map(({ key, value }) => `${formatExp(key)} ${formatExp(value)}`)
        .join(" ")
      if (entries === "") {
        return `(@hash)`
      } else {
        return `(@hash ${entries})`
      }
    }

    case "QuoteExp": {
      return `(@quote ${S.formatSexp(exp.sexp)})`
    }

    case "SexpExp": {
      return `(@sexp ${S.formatSexp(exp.sexp)})`
    }

    case "ArrowExp": {
      const argTypes = exp.argTypes.map(formatExp).join(" ")
      const retType = formatExp(exp.retType)
      if (exp.argTypes.length === 0) {
        return `(-> ${retType})`
      } else {
        return `(-> ${argTypes} ${retType})`
      }
    }

    case "TheExp": {
      return `(the ${formatExp(exp.type)} ${formatExp(exp.instance)})`
    }

    case "CommentExp": {
      if (exp.sexps.length === 0) return `(@comment)`
      const content = exp.sexps.map(S.formatSexp).join(" ")
      return `(@comment ${content})`
    }

    case "MatchExp": {
      if (exp.targets.length === 1) {
        const target = formatExp(exp.targets[0])
        const clauses = formatMatchClauses(exp.clauses)
        return `(match ${target} ${clauses})`
      } else {
        const targets = exp.targets.map(formatExp).join(" ")
        const clauses = formatMatchClauses(exp.clauses)
        return `(multi-match (${targets}) ${clauses})`
      }
    }
  }
}

export function formatBinding(binding: M.Binding): string {
  return `(${binding.name} ${formatExp(binding.rhs)})`
}

export function formatCondClause(clause: M.CondClause): string {
  return `(${formatExp(clause.question)} ${formatExp(clause.answer)})`
}

export function formatMatchClauses(clauses: Array<M.MatchClause>): string {
  return clauses.map(formatMatchClause).join(" ")
}

export function formatMatchClause(clause: M.MatchClause): string {
  if (clause.patterns.length === 1) {
    const pattern = formatExp(clause.patterns[0])
    const body = formatBody(clause.body)
    return `(${pattern} ${body})`
  } else {
    const patterns = clause.patterns.map(formatExp).join(" ")
    const body = formatBody(clause.body)
    return `((${patterns}) ${body})`
  }
}

export function formatBody(body: M.Exp): string {
  if (body.kind === "Begin1Exp") {
    return `${formatExp(body.head)} ${formatBody(body.body)}`
  } else if (body.kind === "Let1Exp") {
    return `(let ((${body.name} ${formatExp(body.rhs)})) ${formatBody(body.body)})`
  } else if (body.kind === "BeginExp") {
    return formatExps(body.sequence)
  } else {
    return formatExp(body)
  }
}

export function formatTermBody(body: M.Term): string {
  if (body.kind === "Begin1Term") {
    return `${M.formatTerm(body.head)} ${formatTermBody(body.body)}`
  } else if (body.kind === "Let1Term") {
    return `(let ((${body.name} ${M.formatTerm(body.rhs)})) ${formatTermBody(body.body)})`
  } else {
    return M.formatTerm(body)
  }
}
