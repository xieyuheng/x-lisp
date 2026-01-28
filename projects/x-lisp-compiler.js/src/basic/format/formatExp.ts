import { type Exp } from "../exp/index.ts"

export function formatExps(exps: Array<Exp>): string {
  return exps.map(formatExp).join(" ")
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

    case "Label": {
      return `(@label ${exp.name})`
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
  }
}
