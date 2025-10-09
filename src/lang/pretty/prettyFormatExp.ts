import * as pp from "../../utils/ppml/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatAtom } from "../format/index.ts"
import { isAtom } from "../value/index.ts"

export function prettyFormatExp(maxWidth: number, exp: Exp): string {
  return pp.format(maxWidth, renderExp(exp))
}

export function renderExps(exps: Array<Exp>): pp.Node {
  if (exps.length === 0) return pp.NullNode()
  else if (exps.length === 1) return renderExp(exps[0])
  else
    return pp.concat(
      renderExp(exps[0]),
      pp.BreakNode(" "),
      renderExps(exps.slice(1)),
    )
}

export function renderExp(exp: Exp): pp.Node {
  if (isAtom(exp)) {
    return pp.TextNode(formatAtom(exp))
  }

  switch (exp.kind) {
    case "Var": {
      return pp.TextNode(exp.name)
    }

    case "Lambda": {
      return pp.GroupNode(
        pp.concat(
          pp.TextNode("(lambda"),
          pp.GroupNode(
            pp.concat(
              pp.TextNode("("),
              renderExps(exp.parameters),
              pp.TextNode(")"),
            ),
          ),
          pp.IndentNode(
            2,
            pp.GroupNode(
              pp.concat(
                pp.BreakNode(" "),
                renderExp(exp.body),
                pp.TextNode(")"),
              ),
            ),
          ),
        ),
      )
    }

    case "VariadicLambda": {
      return pp.NullNode()
      // return `(lambda ${exp.variadicParameter} ${formatBody(exp.body)})`
    }

    case "Thunk": {
      return pp.NullNode()
      // return `(thunk ${formatBody(exp.body)})`
    }

    case "Apply": {
      return pp.NullNode()
      // const target = formatExp(exp.target)
      // const args = formatExps(exp.args)
      // if (args === "") {
      //   return `(${target})`
      // } else {
      //   return `(${target} ${args})`
      // }
    }

    case "Begin": {
      return pp.NullNode()
      // const sequence = formatExps(exp.sequence)
      // return `(begin ${sequence})`
    }

    case "Assign": {
      return pp.NullNode()
      // return `(= ${formatExp(exp.lhs)} ${formatExp(exp.rhs)})`
    }

    case "Assert": {
      return pp.NullNode()
      // return `(assert ${formatExp(exp.exp)})`
    }

    case "AssertNot": {
      return pp.NullNode()
      // return `(assert-not ${formatExp(exp.exp)})`
    }

    case "AssertEqual": {
      return pp.NullNode()
      // return `(assert-equal ${formatExp(exp.lhs)} ${formatExp(exp.rhs)})`
    }

    case "AssertNotEqual": {
      return pp.NullNode()
      // return `(assert-not-equal ${formatExp(exp.lhs)} ${formatExp(exp.rhs)})`
    }

    case "AssertThe": {
      return pp.NullNode()
      // return `(assert-the ${formatExp(exp.schema)} ${formatExp(exp.exp)})`
    }

    case "Tael": {
      return pp.NullNode()
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
      return pp.NullNode()
      // const elements = formatExps(exp.elements)
      // return `{${elements}}`
    }

    case "Hash": {
      return pp.NullNode()
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
      return pp.NullNode()
      // return `(@quote ${formatSexp(exp.sexp)})`
    }

    case "Quasiquote": {
      return pp.NullNode()
      // return `(@quasiquote ${formatSexp(exp.sexp)})`
    }

    case "If": {
      return pp.NullNode()
      // return `(if ${formatExp(exp.condition)} ${formatExp(exp.consequent)} ${formatExp(exp.alternative)})`
    }

    case "When": {
      return pp.NullNode()
      // return `(when ${formatExp(exp.condition)} ${formatExp(exp.consequent)})`
    }

    case "Unless": {
      return pp.NullNode()
      // return `(unless ${formatExp(exp.condition)} ${formatExp(exp.consequent)})`
    }

    case "And": {
      return pp.NullNode()
      // const exps = formatExps(exp.exps)
      // if (exps === "") {
      //   return `(and)`
      // } else {
      //   return `(and ${exps})`
      // }
    }

    case "Or": {
      return pp.NullNode()
      // const exps = formatExps(exp.exps)
      // if (exps === "") {
      //   return `(or)`
      // } else {
      //   return `(or ${exps})`
      // }
    }

    case "Cond": {
      return pp.NullNode()
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
      return pp.NullNode()
      // const target = formatExp(exp.target)
      // const args = formatExps(exp.args)
      // return `(ppecific ${target} ${args}`
    }
  }
}
