import * as Ppml from "@xieyuheng/ppml.js"

const shortLength = 3

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

export function prettyApplication(elements: Array<Ppml.Node>): Ppml.Node {
  if (elements.length === 0) {
    return Ppml.group(Ppml.text("("), Ppml.text(")"))
  }

  const [head, ...rest] = elements
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

export function prettySet(elements: Array<Ppml.Node>): Ppml.Node {
  const bodyNode = Ppml.group(Ppml.indent(1, Ppml.flex(elements)))

  return Ppml.group(Ppml.text("(@set"), bodyNode, Ppml.text(")"))
}

export function prettyList(elements: Array<Ppml.Node>): Ppml.Node {
  if (elements.length === 0) {
    return Ppml.group(Ppml.text("["), Ppml.text("]"))
  }

  const bodyNode = Ppml.group(Ppml.indent(1, Ppml.flex(elements)))

  return Ppml.group(Ppml.text("["), bodyNode, Ppml.text("]"))
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
