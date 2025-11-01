import { type Exp } from "../exp/index.ts"

export function formatExps(exps: Array<Exp>): string {
  return exps.map(formatExp).join(" ")
}

export function formatParameters(parameters: Array<string>): string {
  return parameters.join(" ")
}

export function formatExp(exp: Exp): string {
  switch (exp.kind) {
    case "Var": {
      return exp.name
    }

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

    case "Lambda": {
      return `(lambda (${formatParameters(exp.parameters)}) ${formatBody(exp.body)})`
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

    case "BeginSugar": {
      const sequence = formatExps(exp.sequence)
      return `(begin ${sequence})`
    }

    case "Assign": {
      return `(= ${formatExp(exp.lhs)} ${formatExp(exp.rhs)})`
    }

    case "If": {
      return `(if ${formatExp(exp.condition)} ${formatExp(exp.consequent)} ${formatExp(exp.alternative)})`
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
