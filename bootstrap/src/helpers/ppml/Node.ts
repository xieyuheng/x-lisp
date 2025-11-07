// learned from: christian-lindig/2000-stricty-pretty

export type Node =
  | NullNode
  | TextNode
  | AppendNode
  | IndentNode
  | BreakNode
  | GroupNode

export type NullNode = {
  kind: "NullNode"
}

export function NullNode(): NullNode {
  return { kind: "NullNode" }
}

export type TextNode = {
  kind: "TextNode"
  content: string
}

export function TextNode(content: string): TextNode {
  return { kind: "TextNode", content }
}

export type AppendNode = {
  kind: "AppendNode"
  leftChild: Node
  rightChild: Node
}

export function AppendNode(leftChild: Node, rightChild: Node): AppendNode {
  return {
    kind: "AppendNode",
    leftChild,
    rightChild,
  }
}

export type IndentNode = {
  kind: "IndentNode"
  length: number
  child: Node
}

export function IndentNode(length: number, child: Node): IndentNode {
  return {
    kind: "IndentNode",
    length,
    child,
  }
}

export type BreakNode = {
  kind: "BreakNode"
  space: string
}

export function BreakNode(space: string): BreakNode {
  return {
    kind: "BreakNode",
    space,
  }
}

export type GroupNode = {
  kind: "GroupNode"
  child: Node
}

export function GroupNode(child: Node): GroupNode {
  return {
    kind: "GroupNode",
    child,
  }
}
