import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function desugar(mod: M.Mod, exp: M.Exp): M.Exp {
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
      message += `\n  exp: ${M.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }

    case "If": {
      return M.If(
        desugar(mod, exp.condition),
        desugar(mod, exp.consequent),
        desugar(mod, exp.alternative),
        exp.meta,
      )
    }

    case "When": {
      return M.If(
        desugar(mod, exp.condition),
        desugar(mod, exp.consequent),
        M.Void(),
        exp.meta,
      )
    }

    case "Unless": {
      return M.If(
        desugar(mod, exp.condition),
        M.Void(),
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
      const defaultExp = M.Apply(
        M.Var("error", exp.meta),
        [M.String("match mismatch", exp.meta)],
        exp.meta,
      )

      return desugar(
        mod,
        M.simplifyMatch(mod, exp.targets, exp.clauses, defaultExp, exp.meta),
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
      return M.Apply(
        desugar(mod, exp.target),
        exp.args.map((e) => desugar(mod, e)),
        exp.meta,
      )
    }

    case "Arrow": {
      return M.Arrow(
        exp.argTypes.map((e) => desugar(mod, e)),
        desugar(mod, exp.retType),
        exp.meta,
      )
    }

    case "Begin1": {
      return M.Begin1(desugar(mod, exp.head), desugar(mod, exp.body), exp.meta)
    }

    case "Let1": {
      return M.Let1(
        exp.name,
        desugar(mod, exp.rhs),
        desugar(mod, exp.body),
        exp.meta,
      )
    }

    case "LiteralTuple": {
      return M.LiteralTuple(
        exp.elements.map((e) => desugar(mod, e)),
        exp.meta,
      )
    }

    case "Tau": {
      return M.Tau(
        exp.elementTypes.map((e) => desugar(mod, e)),
        exp.meta,
      )
    }

    case "LiteralRecord": {
      return M.LiteralRecord(
        recordMapValue(exp.attributes, (e) => desugar(mod, e)),
        exp.meta,
      )
    }

    case "Interface": {
      return M.Interface(
        recordMapValue(exp.attributeTypes, (e) => desugar(mod, e)),
        exp.meta,
      )
    }

    case "ExtendInterface": {
      return M.ExtendInterface(
        desugar(mod, exp.baseType),
        recordMapValue(exp.attributeTypes, (e) => desugar(mod, e)),
        exp.meta,
      )
    }

    case "Extend": {
      return M.Extend(
        desugar(mod, exp.base),
        recordMapValue(exp.attributes, (e) => desugar(mod, e)),
        exp.meta,
      )
    }

    case "Update": {
      return M.Update(
        desugar(mod, exp.base),
        recordMapValue(exp.attributes, (e) => desugar(mod, e)),
        exp.meta,
      )
    }

    case "UpdateMut": {
      return M.UpdateMut(
        desugar(mod, exp.base),
        recordMapValue(exp.attributes, (e) => desugar(mod, e)),
        exp.meta,
      )
    }

    case "The": {
      return M.The(desugar(mod, exp.type), desugar(mod, exp.exp), exp.meta)
    }

    case "Lambda": {
      return M.Lambda(exp.parameters, desugar(mod, exp.body), exp.meta)
    }

    case "Polymorphic": {
      return M.Polymorphic(exp.parameters, desugar(mod, exp.body), exp.meta)
    }
  }
}

function desugarBegin(sequence: Array<M.Exp>, meta?: S.TokenMeta): M.Exp {
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
    return M.Let1(head.name, head.rhs, desugarBegin(rest), meta)
  } else {
    return M.Begin1(head, desugarBegin(rest), meta)
  }
}

function desugarAnd(exps: Array<M.Exp>, meta?: S.TokenMeta): M.Exp {
  if (exps.length === 0) return M.Bool(true, meta)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return M.If(head, desugarAnd(restExps, meta), M.Bool(false, meta), meta)
}

function desugarOr(exps: Array<M.Exp>, meta?: S.TokenMeta): M.Exp {
  if (exps.length === 0) return M.Bool(false, meta)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return M.If(head, M.Bool(true, meta), desugarOr(restExps, meta), meta)
}

function desugarCond(clauses: Array<M.CondClause>, meta?: S.TokenMeta): M.Exp {
  if (clauses.length === 0)
    return M.Apply(
      M.Var("error", meta),
      [M.String("cond mismatch", meta)],
      meta,
    )
  const [headClause, ...resClauses] = clauses
  return M.If(
    headClause.question,
    headClause.answer,
    desugarCond(resClauses, meta),
    meta,
  )
}

export function desugarList(elements: Array<M.Exp>, meta?: S.TokenMeta): M.Exp {
  return M.BeginSugar(
    [
      M.AssignSugar("list", M.Apply(M.Var("make-list", meta), [], meta), meta),
      ...elements.map((e) =>
        M.Apply(M.Var("list-push!", meta), [e, M.Var("list", meta)], meta),
      ),
      M.Var("list", meta),
    ],
    meta,
  )
}

function desugarSet(elements: Array<M.Exp>, meta?: S.TokenMeta): M.Exp {
  return M.BeginSugar(
    [
      M.AssignSugar("set", M.Apply(M.Var("make-set", meta), [], meta), meta),
      ...elements.map((e) =>
        M.Apply(M.Var("set-add!", meta), [e, M.Var("set", meta)], meta),
      ),
      M.Var("set", meta),
    ],
    meta,
  )
}

function desugarHash(
  entries: Array<{ key: M.Exp; value: M.Exp }>,
  meta?: S.TokenMeta,
): M.Exp {
  return M.BeginSugar(
    [
      M.AssignSugar("hash", M.Apply(M.Var("make-hash", meta), [], meta), meta),
      ...entries.map((entry) =>
        M.Apply(
          M.Var("hash-put!", meta),
          [entry.key, entry.value, M.Var("hash", meta)],
          meta,
        ),
      ),
      M.Var("hash", meta),
    ],
    meta,
  )
}

function desugarQuote(sexp: S.Sexp, meta?: S.TokenMeta): M.Exp {
  switch (sexp.kind) {
    case "Symbol": {
      return M.Symbol(sexp.content, meta)
    }

    case "String": {
      return M.String(sexp.content, meta)
    }

    case "Int": {
      return M.Int(sexp.content, meta)
    }

    case "Float": {
      return M.Float(sexp.content, meta)
    }

    case "Keyword": {
      return M.Keyword(sexp.content, meta)
    }

    case "List": {
      return M.LiteralList(
        sexp.elements.map((e) => desugarQuote(e, meta)),
        meta,
      )
    }
  }
}
