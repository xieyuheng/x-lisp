import { formatData } from "@xieyuheng/x-data.js"
import { type CondLine, type MatchLine } from "../../lang/exp/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatAtom } from "../format/index.ts"
import { isAtom } from "../value/index.ts"

export function formatExp(exp: Exp): string {
  if (isAtom(exp)) {
    return formatAtom(exp)
  }

  switch (exp.kind) {
    case "Var": {
      return exp.name
    }

    case "Lambda": {
      return `(lambda (${exp.parameters.join(" ")}) ${formatBody(exp.body)})`
    }

    case "Thunk": {
      return `(thunk ${formatBody(exp.body)})`
    }

    case "Apply": {
      const target = formatExp(exp.target)
      const args = exp.args.map(formatExp)
      if (args.length === 0) {
        return `(${target})`
      } else {
        return `(${target} ${args.join(" ")})`
      }
    }

    case "Begin": {
      const sequence = exp.sequence.map(formatExp)
      return `(begin ${sequence.join(" ")})`
    }

    case "Assign": {
      return `(= ${exp.name} ${formatExp(exp.rhs)})`
    }

    case "Assert": {
      return `(assert ${formatExp(exp.exp)})`
    }

    case "Null": {
      return "#null"
    }

    case "Tael": {
      const elements = exp.elements.map(formatExp)
      const attributes = Object.entries(exp.attributes).map(
        ([k, e]) => `:${k} ${formatExp(e)}`,
      )
      if (elements.length === 0 && attributes.length === 0) {
        return `[]`
      } else if (attributes.length === 0) {
        return `[${elements.join(" ")}]`
      } else if (elements.length === 0) {
        return `[${attributes.join(" ")}]`
      } else {
        return `[${elements.join(" ")} ${attributes.join(" ")}]`
      }
    }

    case "Quote": {
      return formatData(exp.data)
    }

    case "If": {
      return `(if ${formatExp(exp.condition)} ${formatExp(exp.consequent)} ${formatExp(exp.alternative)})`
    }

    case "And": {
      const exps = exp.exps.map(formatExp)
      if (exps.length === 0) {
        return `(and)`
      } else {
        return `(and ${exps.join(" ")})`
      }
    }

    case "Or": {
      const exps = exp.exps.map(formatExp)
      if (exps.length === 0) {
        return `(or)`
      } else {
        return `(or ${exps.join(" ")})`
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

    case "Union": {
      const exps = exp.exps.map(formatExp)
      if (exps.length === 0) {
        return `(union)`
      } else {
        return `(union ${exps.join(" ")})`
      }
    }

    case "Inter": {
      const exps = exp.exps.map(formatExp)
      if (exps.length === 0) {
        return `(inter)`
      } else {
        return `(inter ${exps.join(" ")})`
      }
    }

    case "Arrow": {
      const args = exp.args.map(formatExp)
      const ret = formatExp(exp.ret)
      return `(-> ${args.join(" ")} ${ret})`
    }
  }
}

export function formatBody(body: Exp): string {
  if (body.kind === "Begin") {
    return body.sequence.map(formatExp).join(" ")
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
