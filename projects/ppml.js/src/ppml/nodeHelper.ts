import * as Ppml from "./index.ts"

export function group(...nodes: Array<Ppml.Node>): Ppml.Node {
  return Ppml.GroupNode(concat(...nodes))
}

export function nil(): Ppml.Node {
  return Ppml.NullNode()
}

export function br(): Ppml.Node {
  return Ppml.BreakNode(" ")
}

export function flex(nodes: Array<Ppml.Node>): Ppml.Node {
  if (nodes.length === 0) {
    return Ppml.nil()
  } else if (nodes.length === 1) {
    return nodes[0]
  } else {
    return Ppml.concat(nodes[0], Ppml.br(), flex(nodes.slice(1)))
  }
}

export function wrap(nodes: Array<Ppml.Node>): Ppml.Node {
  if (nodes.length === 0) {
    return Ppml.nil()
  }

  let result = nodes[0]
  for (const node of nodes.slice(1)) {
    result = Ppml.group(result, Ppml.br(), node)
  }

  return result
}

export function text(content: string): Ppml.Node {
  return Ppml.TextNode(content)
}

export function indent(indentation: number, ...nodes: Array<Ppml.Node>): Ppml.Node {
  return Ppml.IndentNode(indentation, concat(...nodes))
}

export function concat(...nodes: Array<Ppml.Node>): Ppml.Node {
  if (nodes.length === 0) {
    return Ppml.NullNode()
  } else if (nodes.length === 1) {
    return nodes[0]
  } else {
    const [node, ...rest] = nodes
    return Ppml.AppendNode(node, concat(...rest))
  }
}
