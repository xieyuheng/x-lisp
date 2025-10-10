import * as pp from "../../helper/ppml/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatAtom, formatExp, formatSexp } from "../format/index.ts"
import { isAtom } from "../value/index.ts"

export function prettyExp(maxWidth: number, exp: Exp): string {
  return pp.format(maxWidth, renderExp(exp))
}

export function renderExps(exps: Array<Exp>): pp.Node {
  return pp.mapWithBreak(renderExp, exps)
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
        pp.group(
          pp.text("(lambda"),
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
        pp.group(
          pp.text("(lambda"),
          pp.indent(4, pp.br(), pp.text(exp.variadicParameter)),
        ),
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
      return pp.group(
        pp.text("(begin"),
        pp.indent(2, pp.br(), renderExps(exp.sequence)),
        pp.text(")"),
      )
    }

    case "Assign": {
      return pp.group(
        pp.text("(="),
        pp.text(" "),
        renderExp(exp.lhs),
        pp.indent(3, pp.br(), renderExp(exp.rhs)),
        pp.text(")"),
      )
    }

    case "Assert": {
      return pp.group(
        pp.text("(assert"),
        pp.indent(2, pp.br(), renderExp(exp.exp)),
        pp.text(")"),
      )
    }

    case "AssertNot": {
      return pp.group(
        pp.text("(assert-not"),
        pp.indent(2, pp.br(), renderExp(exp.exp)),
        pp.text(")"),
      )
    }

    case "AssertEqual": {
      return pp.group(
        pp.text("(assert-equal"),
        pp.indent(2, pp.br(), renderExp(exp.lhs)),
        pp.indent(2, pp.br(), renderExp(exp.rhs)),
        pp.text(")"),
      )
    }

    case "AssertNotEqual": {
      return pp.group(
        pp.text("(assert-not-equal"),
        pp.indent(2, pp.br(), renderExp(exp.lhs)),
        pp.indent(2, pp.br(), renderExp(exp.rhs)),
        pp.text(")"),
      )
    }

    case "AssertThe": {
      return pp.group(
        pp.text("(assert-the"),
        pp.indent(2, pp.br(), renderExp(exp.schema)),
        pp.indent(2, pp.br(), renderExp(exp.exp)),
        pp.text(")"),
      )
    }

    case "Tael": {
      const elements = renderExps(exp.elements)
      const attributes = renderAttributes(Object.entries(exp.attributes))
      if (
        exp.elements.length === 0 &&
        Object.keys(exp.attributes).length === 0
      ) {
        return pp.text("[]")
      } else if (Object.keys(exp.attributes).length === 0) {
        return pp.group(pp.text("["), pp.indent(1, elements), pp.text("]"))
      } else if (exp.elements.length === 0) {
        return pp.group(pp.text("["), pp.indent(1, attributes), pp.text("]"))
      } else {
        return pp.group(
          pp.text("["),
          pp.group(pp.indent(1, elements)),
          pp.indent(1, pp.br()),
          pp.indent(1, attributes),
          pp.text("]"),
        )
      }
    }

    case "Set": {
      return pp.group(
        pp.text("{"),
        pp.indent(1, renderExps(exp.elements)),
        pp.text("}"),
      )
    }

    case "Hash": {
      if (exp.entries.length === 0) {
        return pp.text(`(@hash)`)
      } else {
        return pp.group(
          pp.text("(@hash"),
          pp.indent(2, pp.br(), renderHashEntries(exp.entries)),
          pp.text(")"),
        )
      }
    }

    case "Quote": {
      return pp.text(`(@quote ${formatSexp(exp.sexp)})`)
    }

    case "Comment": {
      const sexps = exp.sexps.map(formatSexp).join(" ")
      return pp.text(`(@comment ${sexps})`)
    }

    case "Quasiquote": {
      return pp.text(`(@quasiquote ${formatSexp(exp.sexp)})`)
    }

    case "If": {
      return pp.group(
        pp.group(
          pp.text("(if"),
          pp.indent(4, pp.br(), renderExp(exp.condition)),
        ),
        pp.indent(2, pp.br(), renderExp(exp.consequent)),
        pp.indent(2, pp.br(), renderExp(exp.alternative)),
        pp.text(")"),
      )
    }

    case "When": {
      return pp.group(
        pp.group(
          pp.text("(when"),
          pp.indent(4, pp.br(), renderExp(exp.condition)),
        ),
        pp.indent(2, pp.br(), renderBody(exp.consequent)),
        pp.text(")"),
      )
    }

    case "Unless": {
      return pp.group(
        pp.group(
          pp.text("(unless"),
          pp.indent(4, pp.br(), renderExp(exp.condition)),
        ),
        pp.indent(2, pp.br(), renderBody(exp.consequent)),
        pp.text(")"),
      )
    }

    case "And": {
      if (exp.exps.length === 0) {
        return pp.text(`(and)`)
      } else {
        return pp.group(
          pp.text("(and"),
          pp.indent(2, pp.br(), renderExps(exp.exps)),
          pp.text(")"),
        )
      }
    }

    case "Or": {
      if (exp.exps.length === 0) {
        return pp.text(`(or)`)
      } else {
        return pp.group(
          pp.text("(or"),
          pp.indent(2, pp.br(), renderExps(exp.exps)),
          pp.text(")"),
        )
      }
    }

    case "Cond": {
      return pp.text(formatExp(exp))
    }

    case "Match": {
      return pp.text(formatExp(exp))
    }

    case "Arrow": {
      return pp.group(
        pp.group(
          pp.text("(->"),
          pp.indent(2, pp.br(), renderExps(exp.argSchemas)),
        ),
        pp.indent(2, pp.br(), renderExp(exp.retSchema)),
        pp.text(")"),
      )
    }

    case "VariadicArrow": {
      return pp.group(
        pp.group(
          pp.text("(*->"),
          pp.indent(2, pp.br(), renderExp(exp.argSchema)),
        ),
        pp.indent(2, pp.br(), renderExp(exp.retSchema)),
        pp.text(")"),
      )
    }

    case "Tau": {
      const elementSchemas = renderExps(exp.elementSchemas)
      const attributeSchemas = renderAttributes(
        Object.entries(exp.attributeSchemas),
      )
      if (
        exp.elementSchemas.length === 0 &&
        Object.keys(exp.attributeSchemas).length === 0
      ) {
        return pp.text(`(tau)`)
      } else if (Object.keys(exp.attributeSchemas).length === 0) {
        return pp.group(
          pp.text("(tau"),
          pp.indent(2, elementSchemas),
          pp.text(")"),
        )
      } else if (exp.elementSchemas.length === 0) {
        return pp.group(
          pp.text("(tau"),
          pp.indent(2, attributeSchemas),
          pp.text(")"),
        )
      } else {
        return pp.group(
          pp.text("(tau"),
          pp.group(pp.indent(2, elementSchemas)),
          pp.indent(2, pp.br()),
          pp.indent(2, attributeSchemas),
          pp.text(")"),
        )
      }
    }

    case "The": {
      return pp.group(
        pp.group(pp.text("(the"), pp.indent(4, pp.br(), renderExp(exp.schema))),
        pp.indent(2, pp.br(), renderExp(exp.exp)),
        pp.text(")"),
      )
    }

    case "Pattern": {
      return pp.group(
        pp.text("(@pattern"),
        pp.indent(2, pp.br(), renderExp(exp.pattern)),
        pp.text(")"),
      )
    }

    case "Polymorphic": {
      return pp.group(
        pp.group(
          pp.text("(polymorphic"),
          pp.indent(4, pp.br(), pp.text(`(${exp.parameters.join(" ")})`)),
        ),
        pp.indent(2, pp.br(), renderExp(exp.schema)),
        pp.text(")"),
      )
    }

    case "Specific": {
      return pp.group(
        pp.group(
          pp.text("(specific"),
          pp.indent(4, pp.br(), renderExp(exp.target)),
        ),
        pp.indent(2, pp.br(), renderExps(exp.args)),
        pp.text(")"),
      )
    }
  }
}

export function renderBody(body: Exp): pp.Node {
  if (body.kind === "Begin") {
    return renderExps(body.sequence)
  } else {
    return renderExp(body)
  }
}

function renderAttribute([key, exp]: [string, Exp]): pp.Node {
  return pp.group(pp.text(`:${key}`), pp.br(), renderExp(exp))
}

function renderAttributes(entries: Array<[string, Exp]>): pp.Node {
  return pp.mapWithBreak(renderAttribute, entries)
}

function renderHashEntry(entry: { key: Exp; value: Exp }): pp.Node {
  return pp.group(renderExp(entry.key), pp.br(), renderExp(entry.value))
}

function renderHashEntries(entries: Array<{ key: Exp; value: Exp }>): pp.Node {
  return pp.mapWithBreak(renderHashEntry, entries)
}
