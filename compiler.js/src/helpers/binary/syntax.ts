import type { Exp } from "./Exp.ts"
import * as Exps from "./Exp.ts"
import type { Type } from "./Type.ts"

export function sequence(exps: Array<Exp>): Exps.SequenceExp {
  return Exps.SequenceExp(exps)
}

export function attribute(name: string, type: Type): Exps.AttributeExp {
  return Exps.AttributeExp(name, type)
}

export function dependent(fn: (data: any) => Exp): Exps.DependentExp {
  return Exps.DependentExp(fn)
}
