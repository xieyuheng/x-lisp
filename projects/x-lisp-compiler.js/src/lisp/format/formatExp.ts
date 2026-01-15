import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatAtom } from "./formatAtom.ts"

export function formatExps(exps: Array<Exp>): string {
  return exps.map(formatExp).join(" ")
}

export function formatParameters(parameters: Array<string>): string {
  return parameters.join(" ")
}

export function formatExp(exp: Exp): string {
  if (Exps.isAtom(exp)) {
    return formatAtom(exp)
  }

  switch (exp.kind) {
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

    case "Assert": {
      return `(assert ${formatExp(exp.target)})`
    }

    case "AssertEqual": {
      return `(assert-equal ${formatExp(exp.lhs)} ${formatExp(exp.rhs)})`
    }

    case "AssertNotEqual": {
      return `(assert-not-equal ${formatExp(exp.lhs)} ${formatExp(exp.rhs)})`
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
