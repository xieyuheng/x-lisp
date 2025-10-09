import * as pp from "../../utils/ppml/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatAtom } from "../format/index.ts"
import { isAtom } from "../value/index.ts"

export function prettyFormatExp(maxWidth: number, exp: Exp): string {
  return pp.format(maxWidth, renderExp(exp))
}

export function renderExps(exps: Array<Exp>): pp.Node {
  if (exps.length === 0) return pp.nil()
  else if (exps.length === 1) return renderExp(exps[0])
  else return pp.concat(renderExp(exps[0]), pp.br(), renderExps(exps.slice(1)))
}

export function renderExp(exp: Exp): pp.Node {
  if (isAtom(exp)) {
    return pp.text(formatAtom(exp))
  }

  switch (exp.kind) {
    case "Var": {
      return pp.text(exp.name)
    }

    case "Lambda": {
      return pp.group(
        pp.text("("),
        pp.group(
          pp.text("lambda"),
          pp.indent(
            4,
            pp.br(),
            pp.group(
              pp.text("("),
              pp.indent(1, renderExps(exp.parameters)),
              pp.text(")"),
            ),
          ),
        ),
        pp.indent(2, pp.br(), pp.group(renderBody(exp.body), pp.text(")"))),
      )
    }

    case "VariadicLambda": {
      return pp.group(
        pp.text("(lambda"),
        pp.indent(4, pp.br(), pp.text(exp.variadicParameter)),
        pp.indent(2, pp.br(), pp.group(renderBody(exp.body), pp.text(")"))),
      )
    }

    case "Thunk": {
      return pp.group(
        pp.text("(thunk"),
        pp.indent(2, pp.br(), pp.group(renderBody(exp.body), pp.text(")"))),
      )
    }

    case "Apply": {
      const target = renderExp(exp.target)
      const args = renderExps(exp.args)
      if (exp.args.length === 0) {
        return pp.group(pp.text("("), target, pp.text(")"))
      } else {
        return pp.group(
          pp.text("("),
          pp.indent(1, target, pp.br(), args),
          pp.text(")"),
        )
      }
    }

    case "Begin": {
      const sequence = renderExps(exp.sequence)
      return pp.group(pp.text("("), pp.text("begin"), sequence, pp.text(")"))
    }

    case "Assign": {
      // return `(= ${formatExp(exp.lhs)} ${formatExp(exp.rhs)})`
    }

    case "Assert": {
      // return `(assert ${formatExp(exp.exp)})`
    }

    case "AssertNot": {
      // return `(assert-not ${formatExp(exp.exp)})`
    }

    case "AssertEqual": {
      // return `(assert-equal ${formatExp(exp.lhs)} ${formatExp(exp.rhs)})`
    }

    case "AssertNotEqual": {
      // return `(assert-not-equal ${formatExp(exp.lhs)} ${formatExp(exp.rhs)})`
    }

    case "AssertThe": {
      // return `(assert-the ${formatExp(exp.schema)} ${formatExp(exp.exp)})`
    }

    case "Tael": {
      // const elements = formatExps(exp.elements)
      // const attributes = formatExpAttributes(exp.attributes)
      // if (elements === "" && attributes === "") {
      //   return `[]`
      // } else if (attributes === "") {
      //   return `[${elements}]`
      // } else if (elements === "") {
      //   return `[${attributes}]`
      // } else {
      //   return `[${elements} ${attributes}]`
      // }
    }

    case "Set": {
      // const elements = formatExps(exp.elements)
      // return `{${elements}}`
    }

    case "Hash": {
      // const entries = exp.entries
      //   .map(({ key, value }) => `${formatExp(key)} ${formatExp(value)}`)
      //   .join(" ")
      // if (entries === "") {
      //   return `(@hash)`
      // } else {
      //   return `(@hash ${entries})`
      // }
    }

    case "Quote": {
      // return `(@quote ${formatSexp(exp.sexp)})`
    }

    case "Quasiquote": {
      // return `(@quasiquote ${formatSexp(exp.sexp)})`
    }

    case "If": {
      // return `(if ${formatExp(exp.condition)} ${formatExp(exp.consequent)} ${formatExp(exp.alternative)})`
    }

    case "When": {
      // return `(when ${formatExp(exp.condition)} ${formatExp(exp.consequent)})`
    }

    case "Unless": {
      // return `(unless ${formatExp(exp.condition)} ${formatExp(exp.consequent)})`
    }

    case "And": {
      // const exps = formatExps(exp.exps)
      // if (exps === "") {
      //   return `(and)`
      // } else {
      //   return `(and ${exps})`
      // }
    }

    case "Or": {
      // const exps = formatExps(exp.exps)
      // if (exps === "") {
      //   return `(or)`
      // } else {
      //   return `(or ${exps})`
      // }
    }

    case "Cond": {
      // const condLines = exp.condLines.map(formatCondLine)
      // return `(cond ${condLines.join(" ")})`
    }

    case "Match": {
      // const matchLines = exp.matchLines.map(formatMatchLine)
      // return `(match ${formatExp(exp.target)} ${matchLines.join(" ")})`
    }

    case "Arrow": {
      // const argSchemas = formatExps(exp.argSchemas)
      // const retSchema = formatExp(exp.retSchema)
      // return `(-> ${argSchemas} ${retSchema})`
    }

    case "VariadicArrow": {
      // const argSchema = formatExp(exp.argSchema)
      // const retSchema = formatExp(exp.retSchema)
      // return `(*-> ${argSchema} ${retSchema})`
    }

    case "Tau": {
      // const elementSchemas = formatExps(exp.elementSchemas)
      // const attributeSchemas = formatExpAttributes(exp.attributeSchemas)
      // if (elementSchemas === "" && attributeSchemas === "") {
      //   return `(tau)`
      // } else if (attributeSchemas === "") {
      //   return `(tau ${elementSchemas})`
      // } else if (elementSchemas === "") {
      //   return `(tau ${attributeSchemas})`
      // } else {
      //   return `(tau ${elementSchemas} ${attributeSchemas})`
      // }
    }

    case "The": {
      // return `(the ${formatExp(exp.schema)} ${formatExp(exp.exp)})`
    }

    case "Pattern": {
      // return `(@pattern ${formatExp(exp.pattern)}`
    }

    case "Polymorphic": {
      // const parameters = exp.parameters.join(" ")
      // const schema = formatExp(exp.schema)
      // return `(polymorphic (${parameters}) ${schema}`
    }

    case "Specific": {
      return pp.text("TODO")
      // const target = formatExp(exp.target)
      // const args = formatExps(exp.args)
      // return `(ppecific ${target} ${args}`
    }
  }
}

function renderBody(body: Exp): pp.Node {
  if (body.kind === "Begin") {
    return renderExps(body.sequence)
  } else {
    return renderExp(body)
  }
}
