import * as Ppml from "./index.ts"

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

export function prettyApplication(elements: Array<Ppml.Node>): Ppml.Node {
  if (elements.length === 0) {
    return Ppml.group(Ppml.text("("), Ppml.text(")"))
  }

  const [head, ...rest] = elements
  const shortLength = 3
  if (head.kind === "TextNode" && head.content.length <= shortLength) {
    const indentation = head.content.length + 2
    const bodyNode =
      rest.length === 0
        ? head
        : Ppml.group(
            Ppml.indent(indentation, head, Ppml.text(" "), Ppml.flex(rest)),
          )
    return Ppml.group(Ppml.text("("), bodyNode, Ppml.text(")"))
  }

  const bodyNode = Ppml.group(Ppml.indent(1, Ppml.flex(elements)))
  return Ppml.group(Ppml.text("("), bodyNode, Ppml.text(")"))
}

export function prettyList(elements: Array<Ppml.Node>): Ppml.Node {
  if (elements.length === 0) {
    return Ppml.group(Ppml.text("["), Ppml.text("]"))
  }

  const bodyNode = Ppml.group(Ppml.indent(1, Ppml.flex(elements)))
  return Ppml.group(Ppml.text("["), bodyNode, Ppml.text("]"))
}
