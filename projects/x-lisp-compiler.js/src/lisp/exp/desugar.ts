import { type TokenMeta as Meta, type Sexp } from "@xieyuheng/sexp.js"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"

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

export function desugarQuote(sexp: Sexp, meta?: Meta): Exp {
  switch (sexp.kind) {
    case "Symbol": {
      return Exps.Symbol(sexp.content, meta)
    }

    default: {
      throw new Error()
    }
  }
}
