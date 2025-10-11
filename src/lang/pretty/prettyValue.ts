import assert from "node:assert"
import * as pp from "../../helper/ppml/index.ts"
import { formatAtom, formatPattern, formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { renderBody, renderExp, renderExps } from "./prettyExp.ts"

export function prettyValue(maxWidth: number, value: Value): string {
  return pp.format(maxWidth, renderValue(value))
}

export function prettyValues(maxWidth: number, values: Array<Value>): string {
  return pp.format(maxWidth, renderValues(values))
}

function renderValues(values: Array<Value>): pp.Node {
  if (values.length === 0) {
    return pp.nil()
  } else if (values.length === 1) {
    return renderValue(values[0])
  } else {
    return pp.concat(
      renderValue(values[0]),
      pp.br(),
      renderValues(values.slice(1)),
    )
  }
}

function renderValue(value: Value): pp.Node {
  if (Values.isAtom(value)) {
    return pp.text(formatAtom(value))
  }

  switch (value.kind) {
    case "Tael": {
      const elements = renderValues(value.elements)
      const attributes = renderAttributes(Object.entries(value.attributes))
      if (
        value.elements.length === 0 &&
        Object.keys(value.attributes).length === 0
      ) {
        return pp.text("[]")
      } else if (Object.keys(value.attributes).length === 0) {
        return pp.group(pp.text("["), pp.indent(1, elements), pp.text("]"))
      } else if (value.elements.length === 0) {
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
        pp.indent(1, renderValues(Values.setElements(value))),
        pp.text("}"),
      )
    }

    case "Hash": {
      if (Values.hashLength(value) === 0) {
        return pp.text(`(@hash)`)
      } else {
        return pp.group(
          pp.text("(@hash"),
          pp.indent(2, pp.br(), renderHashEntries(Values.hashEntries(value))),
          pp.text(")"),
        )
      }
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
              pp.indent(1, renderExps(value.parameters)),
              pp.text(")"),
            ),
          ),
        ),
        pp.indent(2, pp.br(), pp.group(renderBody(value.body), pp.text(")"))),
      )
    }

    case "VariadicLambda": {
      return pp.group(
        pp.group(
          pp.text("(lambda"),
          pp.indent(4, pp.br(), pp.text(value.variadicParameter)),
        ),
        pp.indent(2, pp.br(), pp.group(renderBody(value.body), pp.text(")"))),
      )
    }

    case "Thunk": {
      return pp.group(
        pp.text("(thunk"),
        pp.indent(2, pp.br(), pp.group(renderBody(value.body), pp.text(")"))),
      )
    }

    case "Arrow": {
      return pp.group(
        pp.group(
          pp.text("(->"),
          pp.indent(4, pp.br(), renderValues(value.argSchemas)),
        ),
        pp.indent(4, pp.br(), renderValue(value.retSchema)),
        pp.text(")"),
      )
    }

    case "VariadicArrow": {
      return pp.group(
        pp.group(
          pp.text("(*->"),
          pp.indent(5, pp.br(), renderValue(value.argSchema)),
        ),
        pp.indent(5, pp.br(), renderValue(value.retSchema)),
        pp.text(")"),
      )
    }

    case "Tau": {
      const elementSchemas = renderValues(value.elementSchemas)
      const attributeSchemas = renderAttributes(
        Object.entries(value.attributeSchemas),
      )
      if (
        value.elementSchemas.length === 0 &&
        Object.keys(value.attributeSchemas).length === 0
      ) {
        return pp.text(`(tau)`)
      } else if (Object.keys(value.attributeSchemas).length === 0) {
        return pp.group(
          pp.text("(tau"),
          pp.indent(2, elementSchemas),
          pp.text(")"),
        )
      } else if (value.elementSchemas.length === 0) {
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
        pp.group(
          pp.text("(the"),
          pp.indent(4, pp.br(), renderValue(value.schema)),
        ),
        pp.indent(2, pp.br(), renderValue(value.value)),
        pp.text(")"),
      )
    }

    case "Curried": {
      assert(value.args.length > 0)
      return pp.group(
        pp.text("("),
        renderValue(value.target),
        pp.br(),
        renderValues(value.args),
        pp.text(")"),
      )
    }

    case "Pattern": {
      return pp.group(
        pp.text("(@pattern"),
        pp.indent(2, pp.br(), pp.text(formatPattern(value.pattern))),
        pp.text(")"),
      )
    }

    case "Polymorphic": {
      return pp.group(
        pp.group(
          pp.text("(polymorphic"),
          pp.indent(4, pp.br(), pp.text(`(${value.parameters.join(" ")})`)),
        ),
        pp.indent(2, pp.br(), renderExp(value.schema)),
        pp.text(")"),
      )
    }

    default: {
      return pp.text(formatValue(value))
    }
  }
}

function renderAttribute([key, value]: [string, Value]): pp.Node {
  return pp.group(pp.text(`:${key}`), pp.br(), renderValue(value))
}

function renderAttributes(entries: Array<[string, Value]>): pp.Node {
  return pp.flex(entries.map(renderAttribute))
}

function renderHashEntry(entry: { key: Value; value: Value }): pp.Node {
  return pp.group(renderValue(entry.key), pp.br(), renderValue(entry.value))
}

function renderHashEntries(
  entries: Array<{ key: Value; value: Value }>,
): pp.Node {
  return pp.flex(entries.map(renderHashEntry))
}
