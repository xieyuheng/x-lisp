import { type Exp } from "../exp/index.ts"

export function formatExps(exps: Array<Exp>): string {
  return exps.map(formatExp).join(" ")
}

export function formatExp(exp: Exp): string {
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

    case "ApplyExp": {
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
