import * as Ppml from "@xieyuheng/ppml.js"
import { formatAtom } from "../../lisp/format/formatAtom.ts"
import type { Exp } from "../exp/index.ts"
import * as Exps from "../exp/index.ts"

export function prettyExp(
  exp: Exp,
  options: {
    width: number
    indentation?: number
  },
): string {
  return Ppml.format(renderExp(exp), options)
}

function renderExp(exp: Exp): Ppml.Node {
  if (Exps.isAtom(exp)) {
    return Ppml.text(formatAtom(exp))
  }

  switch (exp.kind) {
    case "Sequence": {
      const nodes: Array<Ppml.Node> = []
      let line: Array<Ppml.Node> = []
      for (const e of  exp.exps) {
        if (e.kind === "Bindings") {
          line.push(renderExp(e))
          nodes.push(Ppml.group(...line))
          line = []
        } else {
          line.push(renderExp(e))
          line.push(Ppml.br())
        }
      }

      if (line.length > 0) {
          nodes.push(Ppml.group(...line))
      }

      return Ppml.flex(nodes)
    }

    case "Ref": {
      return Ppml.concat(Ppml.text("@ref"), Ppml.text(" "), Ppml.text(exp.name))
    }

    case "Var": {
      return Ppml.text(exp.name)
    }

    case "TailCall": {
      return Ppml.concat(
        Ppml.text("@tail-call"),
        Ppml.text(" "),
        Ppml.text(exp.name),
      )
    }

    case "Bindings": {
      return Ppml.concat(
        Ppml.text("( "),
        Ppml.text(exp.names.join(" ")),
        Ppml.text(" )"),
      )
    }

    case "If": {
      return Ppml.group(
        Ppml.text("@if"),
        Ppml.indent(2, Ppml.br(), renderExp(exp.consequent)),
        Ppml.text("@else"),
        Ppml.indent(2, Ppml.br(), renderExp(exp.alternative)),
        Ppml.text("@then"),
      )
    }

    case "Return": {
      return Ppml.text("@return")
    }

    case "Assert": {
      return Ppml.text("@assert")
    }

    case "AssertEqual": {
      return Ppml.text("@assert-equal")
    }

    case "AssertNotEqual": {
      return Ppml.text("@assert-not-equal")
    }

    case "Drop": {
      return Ppml.text("@drop")
    }

    case "Apply": {
      return Ppml.text("@apply")
    }

    case "TailApply": {
      return Ppml.text("@tail-apply")
    }

    case "Assign": {
      return Ppml.text("@assign")
    }
  }
}
