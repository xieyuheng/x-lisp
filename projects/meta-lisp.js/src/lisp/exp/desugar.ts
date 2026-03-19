import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"

export function desugar(mod: L.Mod, exp: L.Exp): L.Exp {
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
      return desugar(mod, desugarBegin(exp.sequence, exp.meta))
    }

    case "AssignSugar": {
      let message = `[desugar] (=) must occur in the head of (begin)`
      message += `\n  exp: ${L.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }

    case "If": {
      return L.If(
        desugar(mod, exp.condition),
        desugar(mod, exp.consequent),
        desugar(mod, exp.alternative),
        exp.meta,
      )
    }

    case "When": {
      return L.If(
        desugar(mod, exp.condition),
        desugar(mod, exp.consequent),
        L.Void(),
        exp.meta,
      )
    }

    case "Unless": {
      return L.If(
        desugar(mod, exp.condition),
        L.Void(),
        desugar(mod, exp.alternative),
        exp.meta,
      )
    }

    case "And": {
      return desugar(mod, desugarAnd(exp.exps, exp.meta))
    }

    case "Or": {
      return desugar(mod, desugarOr(exp.exps, exp.meta))
    }

    case "Cond": {
      return desugar(mod, desugarCond(exp.clauses, exp.meta))
    }

    case "Match": {
      const defaultExp = L.Apply(
        L.Var("error", exp.meta),
        [L.String("match mismatch", exp.meta)],
        exp.meta,
      )

      return desugar(
        mod,
        L.simplifyMatch(mod, exp.targets, exp.clauses, defaultExp, exp.meta),
      )
    }

    case "LiteralList": {
      return desugar(mod, desugarList(exp.elements, exp.meta))
    }

    case "LiteralSet": {
      return desugar(mod, desugarSet(exp.elements, exp.meta))
    }

    case "LiteralHash": {
      return desugar(mod, desugarHash(exp.entries, exp.meta))
    }

    case "Quote": {
      return desugar(mod, desugarQuote(exp.sexp, exp.meta))
    }

    case "Apply": {
      return L.Apply(
        desugar(mod, exp.target),
        exp.args.map((e) => desugar(mod, e)),
        exp.meta,
      )
    }

    case "Arrow": {
      return L.Arrow(
        exp.argTypes.map((e) => desugar(mod, e)),
        desugar(mod, exp.retType),
        exp.meta,
      )
    }

    case "Begin1": {
      return L.Begin1(desugar(mod, exp.head), desugar(mod, exp.body), exp.meta)
    }

    case "Let1": {
      return L.Let1(
        exp.name,
        desugar(mod, exp.rhs),
        desugar(mod, exp.body),
        exp.meta,
      )
    }

    case "LiteralTuple": {
      return L.LiteralTuple(
        exp.elements.map((e) => desugar(mod, e)),
        exp.meta,
      )
    }

    case "Tau": {
      return L.Tau(
        exp.elementTypes.map((e) => desugar(mod, e)),
        exp.meta,
      )
    }

    case "LiteralRecord": {
      return L.LiteralRecord(
        recordMapValue(exp.attributes, (e) => desugar(mod, e)),
        exp.meta,
      )
    }

    case "Interface": {
      return L.Class(
        recordMapValue(exp.attributeTypes, (e) => desugar(mod, e)),
        exp.meta,
      )
    }

    case "The": {
      return L.The(desugar(mod, exp.type), desugar(mod, exp.exp), exp.meta)
    }

    case "Lambda": {
      return L.Lambda(exp.parameters, desugar(mod, exp.body), exp.meta)
    }

    case "Polymorphic": {
      return L.Polymorphic(exp.parameters, desugar(mod, exp.body), exp.meta)
    }

    case "Match": {
      throw new Error()
    }
  }
}

function desugarBegin(sequence: Array<L.Exp>, meta?: S.TokenMeta): L.Exp {
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

function desugarAnd(exps: Array<L.Exp>, meta?: S.TokenMeta): L.Exp {
  if (exps.length === 0) return L.Bool(true, meta)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return L.If(head, desugarAnd(restExps, meta), L.Bool(false, meta), meta)
}

function desugarOr(exps: Array<L.Exp>, meta?: S.TokenMeta): L.Exp {
  if (exps.length === 0) return L.Bool(false, meta)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return L.If(head, L.Bool(true, meta), desugarOr(restExps, meta), meta)
}

function desugarCond(clauses: Array<L.CondClause>, meta?: S.TokenMeta): L.Exp {
  if (clauses.length === 0)
    return L.Apply(
      L.Var("error", meta),
      [L.String("cond mismatch", meta)],
      meta,
    )
  const [headClause, ...resClauses] = clauses
  return L.If(
    headClause.question,
    headClause.answer,
    desugarCond(resClauses, meta),
    meta,
  )
}

function desugarList(elements: Array<L.Exp>, meta?: S.TokenMeta): L.Exp {
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

function desugarSet(elements: Array<L.Exp>, meta?: S.TokenMeta): L.Exp {
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

function desugarHash(
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

function desugarQuote(sexp: S.Sexp, meta?: S.TokenMeta): L.Exp {
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
      return L.LiteralList(
        sexp.elements.map((e) => desugarQuote(e, meta)),
        meta,
      )
    }
  }
}
