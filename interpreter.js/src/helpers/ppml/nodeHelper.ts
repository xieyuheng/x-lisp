import * as pp from "./index.ts"

export function group(...nodes: Array<pp.Node>): pp.Node {
  return pp.GroupNode(concat(...nodes))
}

export function nil(): pp.Node {
  return pp.NullNode()
}

export function br(): pp.Node {
  return pp.BreakNode(" ")
}

export function flex(nodes: Array<pp.Node>): pp.Node {
  if (nodes.length === 0) {
    return pp.nil()
  } else if (nodes.length === 1) {
    return nodes[0]
  } else {
    return pp.concat(nodes[0], pp.br(), flex(nodes.slice(1)))
  }
}

export function wrap(nodes: Array<pp.Node>): pp.Node {
  if (nodes.length === 0) {
    return pp.nil()
  }

  let result = nodes[0]
  for (const node of nodes.slice(1)) {
    result = pp.group(result, pp.br(), node)
  }

  return result
}

export function text(content: string): pp.Node {
  return pp.TextNode(content)
}

export function indent(indentation: number, ...nodes: Array<pp.Node>): pp.Node {
  return pp.IndentNode(indentation, concat(...nodes))
}

export function concat(...nodes: Array<pp.Node>): pp.Node {
  if (nodes.length === 0) {
    return pp.NullNode()
  } else if (nodes.length === 1) {
    return nodes[0]
  } else {
    const [node, ...rest] = nodes
    return pp.AppendNode(node, concat(...rest))
  }
}
