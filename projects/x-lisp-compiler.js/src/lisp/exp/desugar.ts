import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"

export function desugarApply(target: Exp, args: Array<Exp>, meta?: Meta): Exp {
  if (args.length === 0) return Exps.ApplyNullary(target, meta)
  if (args.length === 1) return Exps.Apply(target, args[0], meta)
  const [arg, ...restArgs] = args
  return desugarApply(Exps.Apply(target, arg, meta), restArgs, meta)
}

export function desugarAnd(exps: Array<Exp>, meta?: Meta): Exp {
  if (exps.length === 0) return Exps.Bool(true, meta)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return Exps.If(head, desugarAnd(restExps, meta), Exps.Bool(false, meta), meta)
}

export function desugarOr(exps: Array<Exp>, meta?: Meta): Exp {
  if (exps.length === 0) return Exps.Bool(false, meta)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return Exps.If(head, Exps.Bool(true, meta), desugarOr(restExps, meta), meta)
}
