import { formatData } from "@xieyuheng/x-data.js"
import { type CondLine, type MatchLine } from "../../lang/exp/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatAtom } from "../format/index.ts"
import { formatSexp, isAtom } from "../value/index.ts"

export function formatExps(exps: Array<Exp>): string {
  return exps.map(formatExp).join(" ")
}

function formatExpAttributes(attributes: Record<string, Exp>): string {
  return Object.entries(attributes)
    .map(([k, e]) => `:${k} ${formatExp(e)}`)
    .join(" ")
}

export function formatExp(exp: Exp): string {
  if (isAtom(exp)) {
    return formatAtom(exp)
  }

  switch (exp.kind) {
    case "Var": {
      return exp.name
    }

    case "Lambda": {
      return `(lambda (${formatExps(exp.parameters)}) ${formatBody(exp.body)})`
    }

    case "VariadicLambda": {
      return `(lambda ${exp.variadicParameter} ${formatBody(exp.body)})`
    }

    case "Thunk": {
      return `(thunk ${formatBody(exp.body)})`
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

    case "Begin": {
      const sequence = formatExps(exp.sequence)
      return `(begin ${sequence})`
    }

    case "Assign": {
      return `(= ${formatExp(exp.lhs)} ${formatExp(exp.rhs)})`
    }

    case "Assert": {
      return `(assert ${formatExp(exp.exp)})`
    }

    case "AssertNot": {
      return `(assert-not ${formatExp(exp.exp)})`
    }

    case "AssertEqual": {
      return `(assert-equal ${formatExp(exp.lhs)} ${formatExp(exp.rhs)})`
    }

    case "AssertNotEqual": {
      return `(assert-not-equal ${formatExp(exp.lhs)} ${formatExp(exp.rhs)})`
    }

    case "AssertThe": {
      return `(assert-the ${formatExp(exp.schema)} ${formatExp(exp.exp)})`
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
      return formatData(exp.sexp)
    }

    case "Quasiquote": {
      return `(quasiquote ${formatSexp(exp.sexp)})`
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

    case "Match": {
      const matchLines = exp.matchLines.map(formatMatchLine)
      return `(match ${formatExp(exp.target)} ${matchLines.join(" ")})`
    }

    case "Arrow": {
      const argSchemas = formatExps(exp.argSchemas)
      const retSchema = formatExp(exp.retSchema)
      return `(-> ${argSchemas} ${retSchema})`
    }

    case "VariadicArrow": {
      const argSchema = formatExp(exp.argSchema)
      const retSchema = formatExp(exp.retSchema)
      return `(&-> ${argSchema} ${retSchema})`
    }

    case "Tau": {
      const elementSchemas = formatExps(exp.elementSchemas)
      const attributeSchemas = formatExpAttributes(exp.attributeSchemas)
      if (elementSchemas === "" && attributeSchemas === "") {
        return `(tau)`
      } else if (attributeSchemas === "") {
        return `(tau ${elementSchemas})`
      } else if (elementSchemas === "") {
        return `(tau ${attributeSchemas})`
      } else {
        return `(tau ${elementSchemas} ${attributeSchemas})`
      }
    }

    case "The": {
      return `(the ${formatExp(exp.schema)} ${formatExp(exp.exp)})`
    }

    case "Pattern": {
      return `(@pattern ${formatExp(exp.pattern)}`
    }

    case "Polymorphic": {
      const parameters = exp.parameters.join(" ")
      const schema = formatExp(exp.schema)
      return `(polymorphic (${parameters}) ${schema}`
    }

    case "Specific": {
      const target = formatExp(exp.target)
      const args = formatExps(exp.args)
      return `(ppecific ${target} ${args}`
    }
  }
}

export function formatBody(body: Exp): string {
  if (body.kind === "Begin") {
    return formatExps(body.sequence)
  } else {
    return formatExp(body)
  }
}

function formatCondLine(condLine: CondLine): string {
  return `(${formatExp(condLine.question)} ${formatExp(condLine.answer)})`
}

function formatMatchLine(matchLine: MatchLine): string {
  return `(${formatExp(matchLine.pattern)} ${formatBody(matchLine.body)})`
}
