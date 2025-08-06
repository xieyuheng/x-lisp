import { formatData } from "@xieyuheng/x-data.js"
import type { Bind, CondLine } from "../../lang/exp/index.ts"
import { bindsToArray, type Exp } from "../exp/index.ts"
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
      const { names, ret } = formatLambda([exp.name], exp.body)
      return `(lambda (${names.join(" ")}) ${ret})`
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

    case "Let": {
      const binds = bindsToArray(exp.binds).map(formatBind)
      return `(let (${binds.join(" ")}) ${formatExp(exp.body)})`
    }

    case "Begin": {
      const body = exp.sequence.map(formatExp)
      return `(begin ${body.join(" ")})`
    }

    case "Assign": {
      return `(= ${exp.name} ${formatExp(exp.rhs)})`
    }

    case "Assert": {
      return `(assert ${formatExp(exp.exp)})`
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
      return `(cond (${condLines.join(" ")}))`
    }
  }
}

function formatCondLine(condLine: CondLine): string {
  return `(${formatExp(condLine.question)} ${formatExp(condLine.answer)})`
}

function formatLambda(
  names: Array<string>,
  ret: Exp,
): { names: Array<string>; ret: string } {
  if (ret.kind === "Lambda") {
    return formatLambda([...names, ret.name], ret.body)
  } else {
    return { names, ret: formatExp(ret) }
  }
}

function formatBind(bind: Bind): string {
  return `[${bind.name} ${formatExp(bind.exp)}]`
}
