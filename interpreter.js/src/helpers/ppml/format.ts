import * as pp from "./index.ts"

export function format(maxWidth: number, node: pp.Node): string {
  const target: LayoutTarget = [0, "GroupingInline", pp.GroupNode(node)]
  return layout(maxWidth, 0, [target])
}

type GroupingMode = "GroupingInline" | "GroupingBlock"

type LayoutTarget = [indentation: number, mode: GroupingMode, node: pp.Node]

function layout(
  maxWidth: number,
  cursor: number,
  targets: Array<LayoutTarget>,
): string {
  if (targets.length === 0) {
    return ""
  }

  const [[indentation, mode, node], ...restTargets] = targets

  switch (node.kind) {
    case "NullNode": {
      return layout(maxWidth, cursor, restTargets)
    }

    case "TextNode": {
      return (
        node.content +
        layout(maxWidth, cursor + node.content.length, restTargets)
      )
    }

    case "AppendNode": {
      return layout(maxWidth, cursor, [
        [indentation, mode, node.leftChild],
        [indentation, mode, node.rightChild],
        ...restTargets,
      ])
    }

    case "IndentNode": {
      return layout(maxWidth, cursor, [
        [indentation + node.length, mode, node.child],
        ...restTargets,
      ])
    }

    case "BreakNode": {
      switch (mode) {
        case "GroupingInline": {
          return (
            node.space +
            layout(maxWidth, cursor + node.space.length, restTargets)
          )
        }

        case "GroupingBlock": {
          return (
            "\n" +
            " ".repeat(indentation) +
            layout(maxWidth, indentation, restTargets)
          )
        }
      }
    }

    case "GroupNode": {
      const groupingMode = fitInline(maxWidth - cursor, [node.child])
        ? "GroupingInline"
        : "GroupingBlock"

      return layout(maxWidth, cursor, [
        [indentation, groupingMode, node.child],
        ...restTargets,
      ])
    }
  }
}

function fitInline(width: number, nodes: Array<pp.Node>): boolean {
  if (width < 0) return false
  if (nodes.length === 0) return true

  const [node, ...restNodes] = nodes
  switch (node.kind) {
    case "NullNode":
      return fitInline(width, restNodes)
    case "TextNode":
      return fitInline(width - node.content.length, restNodes)
    case "AppendNode":
      return fitInline(width, [node.leftChild, node.rightChild, ...restNodes])
    case "IndentNode":
      return fitInline(width, [node.child, ...restNodes])
    case "BreakNode":
      return fitInline(width - node.space.length, restNodes)
    case "GroupNode":
      return fitInline(width, [node.child, ...restNodes])
  }
}
