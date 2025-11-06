import type { Type } from "./Type.ts"

export type Exp = Sequence | Attribute | Dependent

export type Sequence = {
  kind: "Sequence"
  exps: Array<Exp>
}

export function Sequence(exps: Array<Exp>): Sequence {
  return {
    kind: "Sequence",
    exps,
  }
}

export type Attribute = {
  kind: "Attribute"
  name: string
  type: Type
}

export function Attribute(name: string, type: Type): Attribute {
  return {
    kind: "Attribute",
    name,
    type,
  }
}

export type Dependent = {
  kind: "Dependent"
  fn: (data: any) => Exp
}

export function Dependent(fn: (data: any) => Exp): Dependent {
  return {
    kind: "Dependent",
    fn,
  }
}
