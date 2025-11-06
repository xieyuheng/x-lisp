import type { Exp } from "./Exp.ts"
import * as Exps from "./Exp.ts"
import type { Type } from "./Type.ts"

export function sequence(exps: Array<Exp>): Exps.Sequence {
  return Exps.Sequence(exps)
}

export function attribute(name: string, type: Type): Exps.Attribute {
  return Exps.Attribute(name, type)
}

export function dependent(fn: (data: any) => Exp): Exps.Dependent {
  return Exps.Dependent(fn)
}
