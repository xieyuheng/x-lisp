import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"

export function desugarWhen(exp: L.When, meta?: L.Meta): L.If {
  return L.If(
    exp.condition,
    L.Begin1(exp.consequent, L.Void()),
    L.Void(),
    exp.meta,
  )
}

export function desugarUnless(exp: L.Unless, meta?: L.Meta): L.If {
  return L.If(
    exp.condition,
    L.Void(),
    L.Begin1(exp.alternative, L.Void()),
    exp.meta,
  )
}

export function desugarAnd(exps: Array<L.Exp>, meta?: L.Meta): L.Exp {
  if (exps.length === 0) return L.Bool(true, meta)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return L.If(head, desugarAnd(restExps, meta), L.Bool(false, meta), meta)
}

export function desugarOr(exps: Array<L.Exp>, meta?: L.Meta): L.Exp {
  if (exps.length === 0) return L.Bool(false, meta)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return L.If(head, L.Bool(true, meta), desugarOr(restExps, meta), meta)
}

export function desugarCond(
  condLines: Array<L.CondLine>,
  meta?: L.Meta,
): L.Exp {
  if (condLines.length === 0)
    return L.Apply(L.Var("assert"), [L.Bool(false)], meta)
  const [headLine, ...restLines] = condLines
  return L.If(headLine.question, headLine.answer, desugarCond(restLines, meta))
}

export function desugarTael(
  elements: Array<L.Exp>,
  attributes: Record<string, L.Exp>,
  meta?: L.Meta,
): L.Exp {
  return L.BeginSugar(
    [
      L.AssignSugar("tael", L.Apply(L.Var("make-list"), [])),
      ...elements.map((e) => L.Apply(L.Var("list-push!"), [e, L.Var("tael")])),
      ...Object.entries(attributes).map(([k, v]) =>
        L.Apply(L.Var("record-put!"), [L.Symbol(k), v, L.Var("tael")]),
      ),
      L.Var("tael"),
    ],
    meta,
  )
}

export function desugarSet(elements: Array<L.Exp>, meta?: L.Meta): L.Exp {
  return L.BeginSugar(
    [
      L.AssignSugar("set", L.Apply(L.Var("make-set"), [])),
      ...elements.map((e) => L.Apply(L.Var("set-add!"), [e, L.Var("set")])),
      L.Var("set"),
    ],
    meta,
  )
}

export function desugarHash(
  entries: Array<{ key: L.Exp; value: L.Exp }>,
  meta?: L.Meta,
): L.Exp {
  return L.BeginSugar(
    [
      L.AssignSugar("hash", L.Apply(L.Var("make-hash"), [])),
      ...entries.map((entry) =>
        L.Apply(L.Var("hash-put!"), [entry.key, entry.value, L.Var("hash")]),
      ),
      L.Var("hash"),
    ],
    meta,
  )
}

export function desugarQuote(sexp: S.Sexp, meta?: L.Meta): L.Exp {
  switch (sexp.kind) {
    case "Symbol": {
      return L.Symbol(sexp.content, meta)
    }

    case "String": {
      return L.String(sexp.content, meta)
    }

    case "Int": {
      return L.Int(sexp.content, meta)
    }

    case "Float": {
      return L.Float(sexp.content, meta)
    }

    case "Hashtag": {
      return L.Hashtag(sexp.content, meta)
    }

    case "Tael": {
      return L.Tael(
        sexp.elements.map((e) => desugarQuote(e, meta)),
        recordMapValue(sexp.attributes, (e) => desugarQuote(e, meta)),
        meta,
      )
    }
  }
}
