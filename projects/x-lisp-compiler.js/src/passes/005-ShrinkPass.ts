import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../lisp/index.ts"

export function ShrinkPass(mod: L.Mod): void {
  for (const definition of L.modOwnDefinitions(mod)) {
    onDefinition(definition)
  }
}

function onDefinition(definition: L.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition":
    case "PrimitiveConstantDefinition": {
      return null
    }

    case "FunctionDefinition":
    case "ConstantDefinition": {
      definition.body = onExp(definition.body)
      return null
    }
  }
}

function onExp(exp: L.Exp): L.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "Var": {
      return exp
    }

    case "BeginSugar": {
      if (exp.sequence.length === 0) {
        let message = `[shrink] (begin) must not be empty`
        message += `\n  exp: ${L.formatExp(exp)}`
        if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
        else throw new Error(message)
      }

      const [head, ...rest] = exp.sequence
      if (rest.length === 0) {
        return onExp(head)
      }

      const body = L.BeginSugar(rest, exp.meta)

      if (head.kind === "AssignSugar") {
        return L.Let1(head.name, onExp(head.rhs), onExp(body), exp.meta)
      } else {
        return L.Begin1(onExp(head), onExp(body), head.meta)
      }
    }

    case "AssignSugar": {
      let message = `[shrink] (=) must occur in the head of (begin)`
      message += `\n  exp: ${L.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }

    case "When": {
      return L.If(
        onExp(exp.condition),
        onExp(exp.consequent),
        L.Void(),
        exp.meta,
      )
    }

    case "Unless": {
      return L.If(
        onExp(exp.condition),
        L.Void(),
        onExp(exp.consequent),
        exp.meta,
      )
    }

    case "And": {
      return onExp(desugarAnd(exp.exps.map(onExp), exp.meta))
    }

    case "Or": {
      return onExp(desugarOr(exp.exps.map(onExp), exp.meta))
    }

    case "Tael": {
      return onExp(desugarTael(exp.elements, exp.attributes, exp.meta))
    }

    case "Set": {
      return onExp(desugarSet(exp.elements, exp.meta))
    }

    case "Quote": {
      return onExp(desugarQuote(exp.sexp, exp.meta))
    }

    default: {
      return L.expMap(onExp, exp)
    }
  }
}

function desugarAnd(exps: Array<L.Exp>, meta?: L.Meta): L.Exp {
  if (exps.length === 0) return L.Bool(true, meta)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return L.If(head, desugarAnd(restExps, meta), L.Bool(false, meta), meta)
}

function desugarOr(exps: Array<L.Exp>, meta?: L.Meta): L.Exp {
  if (exps.length === 0) return L.Bool(false, meta)
  if (exps.length === 1) return exps[0]
  const [head, ...restExps] = exps
  return L.If(head, L.Bool(true, meta), desugarOr(restExps, meta), meta)
}

function desugarTael(
  elements: Array<L.Exp>,
  attributes: L.Attributes,
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

function desugarSet(
  elements: Array<L.Exp>,
  meta?: L.Meta,
): L.Exp {
  return L.BeginSugar(
    [
      L.AssignSugar("set", L.Apply(L.Var("make-set"), [])),
      ...elements.map((e) => L.Apply(L.Var("set-add!"), [e, L.Var("set")])),
      L.Var("set"),
    ],
    meta,
  )
}

function desugarQuote(sexp: S.Sexp, meta?: L.Meta): L.Exp {
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
