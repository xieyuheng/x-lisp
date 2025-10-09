// learned from: christian-lindig/2000-stricty-pretty

export type Node =
  | NullNode
  | TextNode
  | AppendNode
  | IndentNode
  | BreakNode
  | GroupNode

export type NullNode = { kind: "NullNode" }
export type TextNode = { kind: "TextNode"; content: string }
export type AppendNode = { kind: "AppendNode"; left: Node; right: Node }
export type IndentNode = { kind: "IndentNode"; length: number; node: Node }
export type BreakNode = { kind: "BreakNode"; space: string }
export type GroupNode = { kind: "GroupNode"; node: Node }
