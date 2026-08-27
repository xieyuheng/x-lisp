export type Operand =
  | SymbolOperand
  | StringOperand
  | IntOperand
  | FloatOperand
  | VarOperand
  | FnOperand
  | PrimOperand
  | GlobalOperand
  | LabelOperand

export type SymbolOperand = {
  kind: "SymbolOperand"
  content: string
}

export function SymbolOperand(content: string): SymbolOperand {
  return {
    kind: "SymbolOperand",
    content,
  }
}

export type StringOperand = {
  kind: "StringOperand"
  content: string
}

export function StringOperand(content: string): StringOperand {
  return {
    kind: "StringOperand",
    content,
  }
}

export type IntOperand = {
  kind: "IntOperand"
  content: bigint
}

export function IntOperand(content: bigint): IntOperand {
  return {
    kind: "IntOperand",
    content,
  }
}

export type FloatOperand = {
  kind: "FloatOperand"
  content: number
}

export function FloatOperand(content: number): FloatOperand {
  return {
    kind: "FloatOperand",
    content,
  }
}

// 局部变量 —— 裸符号，汇编时映射为槽号。
export type VarOperand = {
  kind: "VarOperand"
  name: string
}

export function VarOperand(name: string): VarOperand {
  return {
    kind: "VarOperand",
    name,
  }
}

// 函数定义引用 —— (fn <name>)
export type FnOperand = {
  kind: "FnOperand"
  name: string
}

export function FnOperand(name: string): FnOperand {
  return {
    kind: "FnOperand",
    name,
  }
}

// primitive 函数引用 —— (prim <name>)
export type PrimOperand = {
  kind: "PrimOperand"
  name: string
}

export function PrimOperand(name: string): PrimOperand {
  return {
    kind: "PrimOperand",
    name,
  }
}

// 全局变量引用 —— (global <name>)
export type GlobalOperand = {
  kind: "GlobalOperand"
  name: string
}

export function GlobalOperand(name: string): GlobalOperand {
  return {
    kind: "GlobalOperand",
    name,
  }
}

// 标签引用 —— (label <name>)
export type LabelOperand = {
  kind: "LabelOperand"
  name: string
}

export function LabelOperand(name: string): LabelOperand {
  return {
    kind: "LabelOperand",
    name,
  }
}