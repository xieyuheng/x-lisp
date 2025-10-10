import * as pp from "../../utils/ppml/index.ts"
import { formatAtom } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"

export function prettyValue(maxWidth: number, value: Value): string {
  return pp.format(maxWidth, renderValue(value))
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

  throw new Error("TODO")
}
