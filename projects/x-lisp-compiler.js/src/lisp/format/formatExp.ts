import * as S from "@xieyuheng/sexp.js"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"

export function formatExps(exps: Array<Exp>): string {
  return exps.map(formatExp).join(" ")
}

function formatExpAttributes(attributes: Record<string, Exp>): string {
  return Object.entries(attributes)
    .map(([k, e]) => `:${k} ${formatExp(e)}`)
    .join(" ")
}

export function formatParameters(parameters: Array<string>): string {
  return parameters.join(" ")
}

export function formatExp(exp: Exp): string {
  switch (exp.kind) {
    case "Hashtag": {
      return `#${exp.content}`
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

    case "PrimitiveFunctionRef": {
      return `(@primitive-function-ref ${exp.name} ${exp.arity})`
    }

    case "PrimitiveConstantRef": {
      return `(@primitive-constant-ref ${exp.name})`
    }

    case "FunctionRef": {
      return `(@function-ref ${exp.name} ${exp.arity})`
    }

    case "ConstantRef": {
      return `(@constant-ref ${exp.name})`
    }

    case "Lambda": {
      const parameters = formatParameters(exp.parameters)
      const body = formatBody(exp.body)
      return `(lambda (${parameters}) ${body})`
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
      const body = formatExp(exp.body)
      return `(@let1 ${exp.name} ${rhs} ${body})`
    }

    case "Begin1": {
      const head = formatExp(exp.head)
      const body = formatExp(exp.body)
      return `(@begin1 ${head} ${body})`
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
      return `(unless ${formatExp(exp.condition)} ${formatExp(exp.consequent)})`
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
      const condLines = exp.condLines.map(formatCondLine)
      return `(cond ${condLines.join(" ")})`
    }

    case "Assert": {
      return `(assert ${formatExp(exp.target)})`
    }

    case "AssertEqual": {
      return `(assert-equal ${formatExp(exp.lhs)} ${formatExp(exp.rhs)})`
    }

    case "AssertNotEqual": {
      return `(assert-not-equal ${formatExp(exp.lhs)} ${formatExp(exp.rhs)})`
    }

    case "Tael": {
      const elements = formatExps(exp.elements)
      const attributes = formatExpAttributes(exp.attributes)
      if (elements === "" && attributes === "") {
        return `[]`
      } else if (attributes === "") {
        return `[${elements}]`
      } else if (elements === "") {
        return `[${attributes}]`
      } else {
        return `[${elements} ${attributes}]`
      }
    }

    case "Set": {
      const elements = formatExps(exp.elements)
      return `{${elements}}`
    }

    case "Hash": {
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
  }
}

export function formatBody(body: Exp): string {
  if (body.kind === "BeginSugar") {
    return formatExps(body.sequence)
  } else {
    return formatExp(body)
  }
}

function formatCondLine(condLine: Exps.CondLine): string {
  return `(${formatExp(condLine.question)} ${formatExp(condLine.answer)})`
}
