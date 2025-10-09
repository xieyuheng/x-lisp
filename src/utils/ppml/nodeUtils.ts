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

export function text(content: string): pp.Node {
  return pp.TextNode(content)
}

export function indent(indentation: number, ...nodes: Array<pp.Node>): pp.Node {
  return pp.IndentNode(indentation, concat(...nodes))
}

export function indentGroup(
  indentation: number,
  ...nodes: Array<pp.Node>
): pp.Node {
  return pp.IndentNode(indentation, group(...nodes))
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
