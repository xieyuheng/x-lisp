import * as PPML from "./index.ts"

export function format(maxWidth: number, node: PPML.Node): string {
  const target: LayoutTarget = [0, "GroupingInline", PPML.GroupNode(node)]
  return layout(maxWidth, 0, [target])
}

type GroupingMode = "GroupingInline" | "GroupingBlock"

type LayoutTarget = [indentation: number, mode: GroupingMode, node: PPML.Node]

export function layout(
  maxWidth: number,
  cursor: number,
  targets: Array<LayoutTarget>,
): string {
  return "TODO"
}
