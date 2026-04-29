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
    case "Keyword": {
      return `:${exp.content}`
    }

    case "Symbol": {
      return `'${exp.content}`
    }

    case "String": {
      return JSON.stringify(exp.content)
    }

    case "Int": {
      return exp.content.toString()
    }

    case "Float": {
      if (Number.isInteger(exp.content)) {
        return `${exp.content.toString()}.0`
      } else {
        return exp.content.toString()
      }
    }

    case "Var": {
      return exp.name
    }

    case "QualifiedVar": {
      return `${exp.modName}/${exp.name}`
    }

    case "Lambda": {
      const parameters = formatParameters(exp.parameters)
      const body = formatBody(exp.body)
      return `(lambda (${parameters}) ${body})`
    }

    case "Polymorphic": {
      const parameters = formatParameters(exp.parameters)
      const body = formatExp(exp.body)
      return `(polymorphic (${parameters}) ${body})`
    }

    case "Apply": {
      const target = formatExp(exp.target)
      const args = formatExps(exp.args)
      if (args === "") {
        return `(${target})`
      } else {
        return `(${target} ${args})`
      }
    }

    case "Let1": {
      const rhs = formatExp(exp.rhs)
      const body = formatBody(exp.body)
      return `(begin (= ${exp.name} ${rhs}) ${body})`
    }

    case "Let": {
      const bindings = exp.bindings.map(formatBinding).join(" ")
      const body = formatBody(exp.body)
      return `(let (${bindings}) ${body})`
    }

    case "LetStar": {
      const bindings = exp.bindings.map(formatBinding).join(" ")
      const body = formatBody(exp.body)
      return `(let* (${bindings}) ${body})`
    }

    case "Begin1": {
      const head = formatExp(exp.head)
      const body = formatBody(exp.body)
      return `(begin ${head} ${body})`
    }

    case "BeginSugar": {
      const sequence = formatExps(exp.sequence)
      return `(begin ${sequence})`
    }

    case "AssignSugar": {
      return `(= ${exp.name} ${formatExp(exp.rhs)})`
    }

    case "If": {
      return `(if ${formatExp(exp.condition)} ${formatExp(exp.consequent)} ${formatExp(exp.alternative)})`
    }

    case "When": {
      return `(when ${formatExp(exp.condition)} ${formatExp(exp.consequent)})`
    }

    case "Unless": {
      return `(unless ${formatExp(exp.condition)} ${formatExp(exp.alternative)})`
    }

    case "And": {
      const exps = formatExps(exp.exps)
      if (exps === "") {
        return `(and)`
      } else {
        return `(and ${exps})`
      }
    }

    case "Or": {
      const exps = formatExps(exp.exps)
      if (exps === "") {
        return `(or)`
      } else {
        return `(or ${exps})`
      }
    }

    case "Cond": {
      const clauses = exp.clauses.map(formatCondClause)
      return `(cond ${clauses.join(" ")})`
    }

    case "LiteralList": {
      const elements = formatExps(exp.elements)

      if (elements === "") {
        return `(@list)`
      } else {
        return `(@list ${elements})`
      }
    }

    case "LiteralRecord": {
      const attributes = formatExpAttributes(exp.attributes)
      if (attributes === "") {
        return `(@record)`
      } else {
        return `(@record ${attributes})`
      }
    }

    case "LiteralSet": {
      const elements = formatExps(exp.elements)
      return `(@set ${elements})`
    }

    case "LiteralHash": {
      const entries = exp.entries
        .map(({ key, value }) => `${formatExp(key)} ${formatExp(value)}`)
        .join(" ")
      if (entries === "") {
        return `(@hash)`
      } else {
        return `(@hash ${entries})`
      }
    }

    case "Quote": {
      return `(@quote ${S.formatSexp(exp.sexp)})`
    }

    case "Arrow": {
      const argTypes = exp.argTypes.map(formatExp).join(" ")
      const retType = formatExp(exp.retType)
      return `(-> ${argTypes} ${retType})`
    }

    case "Interface": {
      const attributeTypes = formatExpAttributes(exp.attributeTypes)
      if (attributeTypes === "") {
        return `(interface)`
      } else {
        return `(interface ${attributeTypes})`
      }
    }

    case "ExtendInterface": {
      const baseType = formatExp(exp.baseType)
      const attributeTypes = formatExpAttributes(exp.attributeTypes)
      if (attributeTypes === "") {
        return `(extend-interface ${baseType})`
      } else {
        return `(extend-interface ${baseType} ${attributeTypes})`
      }
    }

    case "Extend": {
      const base = formatExp(exp.base)
      const attributes = formatExpAttributes(exp.attributes)
      if (attributes === "") {
        return `(extend ${base})`
      } else {
        return `(extend ${base} ${attributes})`
      }
    }

    case "Update": {
      const base = formatExp(exp.base)
      const attributes = formatExpAttributes(exp.attributes)
      if (attributes === "") {
        return `(update ${base})`
      } else {
        return `(update ${base} ${attributes})`
      }
    }

    case "UpdateMut": {
      const base = formatExp(exp.base)
      const attributes = formatExpAttributes(exp.attributes)
      if (attributes === "") {
        return `(update! ${base})`
      } else {
        return `(update! ${base} ${attributes})`
      }
    }

    case "The": {
      return `(the ${formatExp(exp.type)} ${formatExp(exp.exp)})`
    }

    case "Match": {
      if (exp.targets.length === 1) {
        const target = formatExp(exp.targets[0])
        const clauses = formatMatchClauses(exp.clauses)
        return `(match ${target} ${clauses})`
      } else {
        const targets = exp.targets.map(formatExp).join(" ")
        const clauses = formatMatchClauses(exp.clauses)
        return `(match-many (${targets}) ${clauses})`
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
  if (body.kind === "Begin1") {
    return `${formatExp(body.head)} ${formatBody(body.body)}`
  } else if (body.kind === "Let1") {
    return `(= ${body.name} ${formatExp(body.rhs)}) ${formatBody(body.body)}`
  } else if (body.kind === "BeginSugar") {
    return formatExps(body.sequence)
  } else {
    return formatExp(body)
  }
}
