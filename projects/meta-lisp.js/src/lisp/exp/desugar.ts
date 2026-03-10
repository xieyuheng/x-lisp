import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"
import { recordMapValue } from "@xieyuheng/helpers.js/record"

export function desugar(exp: L.Exp): L.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "Var":
    case "Require": {
      return exp
    }

    case "BeginSugar": {
      return desugar(L.desugarBegin(exp.sequence, exp.meta))
    }

    case "AssignSugar": {
      let message = `[desugar] (=) must occur in the head of (begin)`
      message += `\n  exp: ${L.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }

    case "If": {
      return L.If(
        desugar(exp.condition),
        desugar(exp.consequent),
        desugar(exp.alternative),
        exp.meta,
      )
    }

    case "When": {
      return L.If(
        desugar(exp.condition),
        desugar(exp.consequent),
        L.Void(),
        exp.meta,
      )
    }

    case "Unless": {
      return L.If(
        desugar(exp.condition),
        L.Void(),
        desugar(exp.alternative),
        exp.meta,
      )
    }

    case "And": {
      return desugar(L.desugarAnd(exp.exps, exp.meta))
    }

    case "Or": {
      return desugar(L.desugarOr(exp.exps, exp.meta))
    }

    case "Cond": {
      return desugar(L.desugarCond(exp.condClauses, exp.meta))
    }

    case "Set": {
      return desugar(L.desugarSet(exp.elements, exp.meta))
    }

    case "Hash": {
      return desugar(L.desugarHash(exp.entries, exp.meta))
    }

    case "Quote": {
      return desugar(L.desugarQuote(exp.sexp, exp.meta))
    }

    case "Apply": {
      return L.Apply(desugar(exp.target), exp.args.map(desugar), exp.meta)
    }

    case "Arrow": {
      return L.Arrow(exp.argTypes.map(desugar), desugar(exp.retType), exp.meta)
    }

    case "Begin1": {
      return L.Begin1(desugar(exp.head), desugar(exp.body), exp.meta)
    }

    case "Let1": {
      return L.Let1(exp.name, desugar(exp.rhs), desugar(exp.body), exp.meta)
    }

    case "List": {
      return L.List(exp.elements.map(desugar), exp.meta)
    }

    case "Set": {
      return L.Set(exp.elements.map(desugar), exp.meta)
    }

    case "Tuple": {
      return L.Tuple(exp.elements.map(desugar), exp.meta)
    }

    case "Tau": {
      return L.Tau(exp.elementTypes.map(desugar), exp.meta)
    }

    case "Object": {
      return L.Object(recordMapValue(exp.attributes, desugar), exp.meta)
    }

    case "Class": {
      return L.Class(recordMapValue(exp.attributeTypes, desugar), exp.meta)
    }

    case "The": {
      return L.The(desugar(exp.type), desugar(exp.exp), exp.meta)
    }

    case "Lambda": {
      return L.Lambda(exp.parameters, desugar(exp.body), exp.meta)
    }

    case "Polymorphic": {
      return L.Polymorphic(exp.parameters, desugar(exp.body), exp.meta)
    }
  }
}

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
