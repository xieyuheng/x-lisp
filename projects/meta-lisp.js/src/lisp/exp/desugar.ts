import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"

export function desugarBegin(
  sequence: Array<L.Exp>,
  meta?: S.TokenMeta,
): L.Exp {
  if (sequence.length === 0) {
    let message = `[desugarBegin] (begin) must not be empty`
    if (meta) throw new S.ErrorWithMeta(message, meta)
    else throw new Error(message)
  }

  const [head, ...rest] = sequence
  if (rest.length === 0) {
    return head
  }

  if (head.kind === "AssignSugar") {
    return L.Let1(head.name, head.rhs, desugarBegin(rest), meta)
  } else {
    return L.Begin1(head, desugarBegin(rest), meta)
  }
}

export function desugarWhen(exp: L.When, meta?: S.TokenMeta): L.If {
  return L.If(
    exp.condition,
    L.Begin1(exp.consequent, L.Void(meta), meta),
    L.Void(meta),
    exp.meta,
  )
}

export function desugarUnless(exp: L.Unless, meta?: S.TokenMeta): L.If {
  return L.If(
    exp.condition,
    L.Void(meta),
    L.Begin1(exp.alternative, L.Void(meta), meta),
    exp.meta,
  )
}

export function desugarAnd(exps: Array<L.Exp>, meta?: S.TokenMeta): L.Exp {
  if (exps.length === 0) return L.Bool(true, meta)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return L.If(head, desugarAnd(restExps, meta), L.Bool(false, meta), meta)
}

export function desugarOr(exps: Array<L.Exp>, meta?: S.TokenMeta): L.Exp {
  if (exps.length === 0) return L.Bool(false, meta)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return L.If(head, L.Bool(true, meta), desugarOr(restExps, meta), meta)
}

export function desugarCond(
  condClauses: Array<L.CondClause>,
  meta?: S.TokenMeta,
): L.Exp {
  if (condClauses.length === 0)
    return L.Apply(
      L.Var("error", meta),
      [L.String("cond mismatch", meta)],
      meta,
    )
  const [headClause, ...resClauses] = condClauses
  return L.If(
    headClause.question,
    headClause.answer,
    desugarCond(resClauses, meta),
    meta,
  )
}

export function desugarList(elements: Array<L.Exp>, meta?: S.TokenMeta): L.Exp {
  return L.BeginSugar(
    [
      L.AssignSugar("list", L.Apply(L.Var("make-list", meta), [], meta), meta),
      ...elements.map((e) =>
        L.Apply(L.Var("list-push!", meta), [e, L.Var("list", meta)], meta),
      ),
      L.Var("list", meta),
    ],
    meta,
  )
}

export function desugarSet(elements: Array<L.Exp>, meta?: S.TokenMeta): L.Exp {
  return L.BeginSugar(
    [
      L.AssignSugar("set", L.Apply(L.Var("make-set", meta), [], meta), meta),
      ...elements.map((e) =>
        L.Apply(L.Var("set-add!", meta), [e, L.Var("set", meta)], meta),
      ),
      L.Var("set", meta),
    ],
    meta,
  )
}

export function desugarHash(
  entries: Array<{ key: L.Exp; value: L.Exp }>,
  meta?: S.TokenMeta,
): L.Exp {
  return L.BeginSugar(
    [
      L.AssignSugar("hash", L.Apply(L.Var("make-hash", meta), [], meta), meta),
      ...entries.map((entry) =>
        L.Apply(
          L.Var("hash-put!", meta),
          [entry.key, entry.value, L.Var("hash", meta)],
          meta,
        ),
      ),
      L.Var("hash", meta),
    ],
    meta,
  )
}

export function desugarQuote(sexp: S.Sexp, meta?: S.TokenMeta): L.Exp {
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

    case "Keyword": {
      return L.Keyword(sexp.content, meta)
    }

    case "List": {
      return L.List(
        sexp.elements.map((e) => desugarQuote(e, meta)),
        meta,
      )
    }
  }
}
