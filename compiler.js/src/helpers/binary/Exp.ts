import type { Type } from "./Type.ts"

export type Exp = SequenceExp | AttributeExp | DependentExp

export type SequenceExp = {
  kind: "SequenceExp"
  exps: Array<Exp>
}

export function SequenceExp(exps: Array<Exp>): SequenceExp {
  return {
    kind: "SequenceExp",
    exps,
  }
}

export type AttributeExp = {
  kind: "AttributeExp"
  name: string
  type: Type
}

export function AttributeExp(name: string, type: Type): AttributeExp {
  return {
    kind: "AttributeExp",
    name,
    type,
  }
}

export type DependentExp = {
  kind: "DependentExp"
  fn: (data: any) => Exp
}

export function DependentExp(fn: (data: any) => Exp): DependentExp {
  return {
    kind: "DependentExp",
    fn,
  }
}
