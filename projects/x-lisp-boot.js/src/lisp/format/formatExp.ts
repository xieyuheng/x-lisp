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

    case "FunctionRef": {
      if (exp.attributes.isPrimitive) {
        return `(@primitive-function ${exp.name} ${exp.arity})`
      } else {
        return `(@function ${exp.name} ${exp.arity})`
      }
    }

    case "ConstantRef": {
      if (exp.attributes.isPrimitive) {
        return `(@primitive-constant ${exp.name})`
      } else {
        return `(@constant ${exp.name})`
      }
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
      const parameters = formatParameters(exp.parameters)
      const body = formatBody(exp.body)
      return `(lambda (${parameters}) ${body})`
    }

    case "ApplySugar": {
      const target = formatExp(exp.target)
      const args = formatExps(exp.args)
      if (args === "") {
        return `(${target})`
      } else {
        return `(${target} ${args})`
      }
    }

    case "ApplyNullary": {
      const target = formatExp(exp.target)
      return `(${target})`
    }

    case "Apply": {
      const target = formatExp(exp.target)
      const arg = formatExp(exp.arg)
      return `(${target} ${arg})`
    }

    case "Let1": {
      const rhs = formatExp(exp.rhs)
      const body = formatExp(exp.body)
      return `(@let1 ${exp.name} ${rhs} ${body})`
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
  }
}

export function formatBody(body: Exp): string {
  if (body.kind === "BeginSugar") {
    return formatExps(body.sequence)
  } else {
    return formatExp(body)
  }
}
