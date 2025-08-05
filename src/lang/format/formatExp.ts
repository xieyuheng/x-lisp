import { formatData } from "@xieyuheng/x-data.js"
import type { Bind } from "../../lang/exp/index.ts"
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
      const { target, args } = formatApply(exp.target, [formatExp(exp.arg)])
      return `(${target} ${args.join(" ")})`
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
      return `(if ${formatExp(exp.testExp)} ${formatExp(exp.thenExp)} ${formatExp(exp.elseExp)})`
    }
  }
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

function formatApply(
  target: Exp,
  args: Array<string>,
): { target: string; args: Array<string> } {
  if (target.kind === "Apply") {
    return formatApply(target.target, [formatExp(target.arg), ...args])
  } else {
    return { target: formatExp(target), args }
  }
}

function formatBind(bind: Bind): string {
  return `[${bind.name} ${formatExp(bind.exp)}]`
}
