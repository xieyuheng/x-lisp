import * as Ppml from "@xieyuheng/ppml.js"

export function prettySet(elements: Array<Ppml.Node>): Ppml.Node {
  const bodyNode = Ppml.group(Ppml.indent(1, Ppml.flex(elements)))

  return Ppml.group(Ppml.text("(@set"), bodyNode, Ppml.text(")"))
}

export function prettyQuote(child: Ppml.Node): Ppml.Node {
  return Ppml.concat(Ppml.text("'"), child)
}

export function prettyUnquote(child: Ppml.Node): Ppml.Node {
  return Ppml.concat(Ppml.text(","), child)
}

export function prettyQuasiquote(child: Ppml.Node): Ppml.Node {
  return Ppml.concat(Ppml.text("`"), child)
}
