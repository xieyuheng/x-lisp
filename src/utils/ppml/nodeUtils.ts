import * as PPML from "./index.ts"

export function concatNode(nodes: Array<PPML.Node>): PPML.Node {
  if (nodes.length === 0) {
    return PPML.NullNode()
  } else if (nodes.length === 1) {
    return nodes[0]
  } else {
    const [node, ...rest] = nodes
    return PPML.AppendNode(node, concatNode(rest))
  }
}
