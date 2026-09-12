import * as S from "@xieyuheng/sexp.js"
import { langKeyword } from "../language/Lang.ts"
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
      return `(${langKeyword("lambda", "函")} (${parameters}) ${body})`
    }

    case "AllExp": {
      const parameters = formatParameters(exp.parameters)
      const body = formatExp(exp.body)
      return `(${langKeyword("all", "泛型")} (${parameters}) ${body})`
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

    case "Let1Exp": {
      const rhs = formatExp(exp.rhs)
      const body = formatBody(exp.body)
      return `(${langKeyword("let", "令")} ((${exp.name} ${rhs})) ${body})`
    }

    case "LetExp": {
      const bindings = exp.bindings.map(formatBinding).join(" ")
      const body = formatBody(exp.body)
      return `(${langKeyword("let", "令")} (${bindings}) ${body})`
    }

    case "LetrecExp": {
      const bindings = exp.bindings.map(formatBinding).join(" ")
      const body = formatBody(exp.body)
      return `(${langKeyword("letrec", "递归令")} (${bindings}) ${body})`
    }

    case "LocalDefineExp": {
      if (exp.parameters.length > 0) {
        const params = exp.parameters.join(" ")
        return `(${langKeyword("define", "定义")} (${exp.name} ${params}) ${formatBody(exp.body)})`
      } else {
        return `(${langKeyword("define", "定义")} ${exp.name} ${formatBody(exp.body)})`
      }
    }

    case "Begin1Exp": {
      const head = formatExp(exp.head)
      const body = formatBody(exp.body)
      return `(${langKeyword("begin", "循序")} ${head} ${body})`
    }

    case "BeginExp": {
      const sequence = formatExps(exp.sequence)
      return `(${langKeyword("begin", "循序")} ${sequence})`
    }

    case "IfExp": {
      return `(${langKeyword("if", "若")} ${formatExp(exp.condition)} ${formatExp(exp.consequent)} ${formatExp(exp.alternative)})`
    }

    case "WhenExp": {
      return `(${langKeyword("when", "当")} ${formatExp(exp.condition)} ${formatExp(exp.consequent)})`
    }

    case "UnlessExp": {
      return `(${langKeyword("unless", "除非")} ${formatExp(exp.condition)} ${formatExp(exp.alternative)})`
    }

    case "AndExp": {
      const exps = formatExps(exp.exps)
      if (exps === "") {
        return `(${langKeyword("and", "且")})`
      } else {
        return `(${langKeyword("and", "且")} ${exps})`
      }
    }

    case "OrExp": {
      const exps = formatExps(exp.exps)
      if (exps === "") {
        return `(${langKeyword("or", "或")})`
      } else {
        return `(${langKeyword("or", "或")} ${exps})`
      }
    }

    case "CondExp": {
      const clauses = exp.clauses.map(formatCondClause)
      return `(${langKeyword("cond", "若则")} ${clauses.join(" ")})`
    }

    case "ListExp": {
      const elements = formatExps(exp.elements)

      if (elements === "") {
        return `(${langKeyword("@list", "@列表")})`
      } else {
        return `(${langKeyword("@list", "@列表")} ${elements})`
      }
    }

    case "ArrayExp": {
      const elements = formatExps(exp.elements)

      if (elements === "") {
        return `(${langKeyword("@array", "@数组")})`
      } else {
        return `(${langKeyword("@array", "@数组")} ${elements})`
      }
    }

    case "TextConcatExp": {
      const elements = formatExps(exp.elements)
      if (elements === "") {
        return `(${langKeyword("@text", "@文本")})`
      } else {
        return `(${langKeyword("@text", "@文本")} ${elements})`
      }
    }

    case "SetExp": {
      const elements = formatExps(exp.elements)
      return `(${langKeyword("@set", "@集合")} ${elements})`
    }

    case "HashExp": {
      const entries = exp.entries
        .map(({ key, value }) => `${formatExp(key)} ${formatExp(value)}`)
        .join(" ")
      if (entries === "") {
        return `(${langKeyword("@hash", "@散列")})`
      } else {
        return `(${langKeyword("@hash", "@散列")} ${entries})`
      }
    }

    case "QuoteExp": {
      return `(${langKeyword("@quote", "@引用")} ${S.formatSexp(exp.sexp)})`
    }

    case "SexpExp": {
      return `(${langKeyword("@sexp", "@符号算式")} ${S.formatSexp(exp.sexp)})`
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
      return `(${langKeyword("the", "型例")} ${formatExp(exp.type)} ${formatExp(exp.instance)})`
    }

    case "CommentExp": {
      if (exp.sexps.length === 0) return `(${langKeyword("@comment", "@注释")})`
      const content = exp.sexps.map(S.formatSexp).join(" ")
      return `(${langKeyword("@comment", "@注释")} ${content})`
    }

    case "MatchExp": {
      if (exp.targets.length === 1) {
        const target = formatExp(exp.targets[0])
        const clauses = formatMatchClauses(exp.clauses)
        return `(${langKeyword("match", "匹配")} ${target} ${clauses})`
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
    return `(${langKeyword("let", "令")} ((${body.name} ${formatExp(body.rhs)})) ${formatBody(body.body)})`
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
    return `(${langKeyword("let", "令")} ((${body.name} ${M.formatTerm(body.rhs)})) ${formatTermBody(body.body)})`
  } else {
    return M.formatTerm(body)
  }
}
