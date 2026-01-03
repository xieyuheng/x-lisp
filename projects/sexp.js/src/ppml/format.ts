import * as Ppml from "./index.ts"

export function format(maxWidth: number, node: Ppml.Node): string {
  const target: LayoutTarget = [0, "GroupingInline", Ppml.GroupNode(node)]
  const parts: Array<string> = []
  layout(maxWidth, 0, [target], parts)
  return parts.join("")
}

type GroupingMode = "GroupingInline" | "GroupingBlock"

type LayoutTarget = [indentation: number, mode: GroupingMode, node: Ppml.Node]

function layout(
  maxWidth: number,
  cursor: number,
  targets: Array<LayoutTarget>,
  parts: Array<string>,
): void {
  while (targets.length > 0) {
    const [[indentation, mode, node], ...restTargets] = targets

    switch (node.kind) {
      case "NullNode": {
        targets = restTargets
        continue
      }

      case "TextNode": {
        parts.push(node.content)
        cursor = cursor + node.content.length
        targets = restTargets
        continue
      }

      case "AppendNode": {
        targets = [
          [indentation, mode, node.leftChild],
          [indentation, mode, node.rightChild],
          ...restTargets,
        ]
        continue
      }

      case "IndentNode": {
        targets = [
          [indentation + node.length, mode, node.child],
          ...restTargets,
        ]
        continue
      }

      case "BreakNode": {
        switch (mode) {
          case "GroupingInline": {
            parts.push(node.space)
            ;((cursor = cursor + node.space.length), (targets = restTargets))
            continue
          }

          case "GroupingBlock": {
            parts.push("\n" + " ".repeat(indentation))
            cursor = indentation
            targets = restTargets
            continue
          }
        }
      }

      case "GroupNode": {
        const groupingMode = fitInline(maxWidth - cursor, [node.child])
          ? "GroupingInline"
          : "GroupingBlock"

        targets = [[indentation, groupingMode, node.child], ...restTargets]
        continue
      }
    }
  }
}

function fitInline(width: number, nodes: Array<Ppml.Node>): boolean {
  while (true) {
    if (width < 0) return false
    if (nodes.length === 0) return true

    const [node, ...restNodes] = nodes
    switch (node.kind) {
      case "NullNode": {
        nodes = restNodes
        continue
      }

      case "TextNode": {
        width = width - node.content.length
        nodes = restNodes
        continue
      }

      case "AppendNode": {
        nodes = [node.leftChild, node.rightChild, ...restNodes]
        continue
      }

      case "IndentNode": {
        nodes = [node.child, ...restNodes]
        continue
      }

      case "BreakNode": {
        width = width - node.space.length
        nodes = restNodes
        continue
      }

      case "GroupNode": {
        nodes = [node.child, ...restNodes]
        continue
      }
    }
  }
}
