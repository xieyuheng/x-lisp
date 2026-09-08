export type Operand =
  | SymbolOperand
  | StringOperand
  | IntOperand
  | FloatOperand
  | U16Operand
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

export function isSymbolOperand(operand: Operand): operand is SymbolOperand {
  return operand.kind === "SymbolOperand"
}

export function asSymbolOperand(operand: Operand): SymbolOperand {
  if (!isSymbolOperand(operand)) {
    throw new Error("[asSymbolOperand] expected SymbolOperand")
  }
  return operand
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

export function isStringOperand(operand: Operand): operand is StringOperand {
  return operand.kind === "StringOperand"
}

export function asStringOperand(operand: Operand): StringOperand {
  if (!isStringOperand(operand)) {
    throw new Error("[asStringOperand] expected StringOperand")
  }
  return operand
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

export function isIntOperand(operand: Operand): operand is IntOperand {
  return operand.kind === "IntOperand"
}

export function asIntOperand(operand: Operand): IntOperand {
  if (!isIntOperand(operand)) {
    throw new Error("[asIntOperand] expected IntOperand")
  }
  return operand
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

export function isFloatOperand(operand: Operand): operand is FloatOperand {
  return operand.kind === "FloatOperand"
}

export function asFloatOperand(operand: Operand): FloatOperand {
  if (!isFloatOperand(operand)) {
    throw new Error("[asFloatOperand] expected FloatOperand")
  }
  return operand
}

export type U16Operand = {
  kind: "U16Operand"
  content: number
}

export function U16Operand(content: number): U16Operand {
  return {
    kind: "U16Operand",
    content,
  }
}

export function isU16Operand(operand: Operand): operand is U16Operand {
  return operand.kind === "U16Operand"
}

export function asU16Operand(operand: Operand): U16Operand {
  if (!isU16Operand(operand)) {
    throw new Error("[asU16Operand] expected U16Operand")
  }
  return operand
}

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

export function isVarOperand(operand: Operand): operand is VarOperand {
  return operand.kind === "VarOperand"
}

export function asVarOperand(operand: Operand): VarOperand {
  if (!isVarOperand(operand)) {
    throw new Error("[asVarOperand] expected VarOperand")
  }
  return operand
}

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

export function isFnOperand(operand: Operand): operand is FnOperand {
  return operand.kind === "FnOperand"
}

export function asFnOperand(operand: Operand): FnOperand {
  if (!isFnOperand(operand)) {
    throw new Error("[asFnOperand] expected FnOperand")
  }
  return operand
}

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

export function isPrimOperand(operand: Operand): operand is PrimOperand {
  return operand.kind === "PrimOperand"
}

export function asPrimOperand(operand: Operand): PrimOperand {
  if (!isPrimOperand(operand)) {
    throw new Error("[asPrimOperand] expected PrimOperand")
  }
  return operand
}

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

export function isGlobalOperand(operand: Operand): operand is GlobalOperand {
  return operand.kind === "GlobalOperand"
}

export function asGlobalOperand(operand: Operand): GlobalOperand {
  if (!isGlobalOperand(operand)) {
    throw new Error("[asGlobalOperand] expected GlobalOperand")
  }
  return operand
}

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

export function isLabelOperand(operand: Operand): operand is LabelOperand {
  return operand.kind === "LabelOperand"
}

export function asLabelOperand(operand: Operand): LabelOperand {
  if (!isLabelOperand(operand)) {
    throw new Error("[asLabelOperand] expected LabelOperand")
  }
  return operand
}
