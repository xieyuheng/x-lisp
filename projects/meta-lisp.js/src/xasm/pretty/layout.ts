import * as Ppml from "@xieyuheng/ppml.js"

export function prettyText(content: string): Ppml.Node {
  return Ppml.text(content)
}

export function prettySyntax(
  name: string,
  header: Array<Ppml.Node>,
  body: Array<Ppml.Node>,
): Ppml.Node {
  const headNode = Ppml.indent(4, Ppml.wrap([Ppml.text(name), ...header]))

  const bodyNode =
    body.length === 0 ? Ppml.nil() : Ppml.indent(2, Ppml.br(), Ppml.flex(body))

  return Ppml.group(Ppml.text("("), headNode, bodyNode, Ppml.text(")"))
}
