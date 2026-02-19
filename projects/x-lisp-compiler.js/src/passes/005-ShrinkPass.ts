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
    case "PrimitiveVariableDefinition":
    case "DatatypeDefinition": {
      return null
    }

    case "FunctionDefinition":
    case "VariableDefinition": {
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
        let message = `[ShrinkPass] (begin) must not be empty`
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
      let message = `[ShrinkPass] (=) must occur in the head of (begin)`
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
      return onExp(L.desugarAnd(exp.exps.map(onExp), exp.meta))
    }

    case "Or": {
      return onExp(L.desugarOr(exp.exps.map(onExp), exp.meta))
    }

    case "Cond": {
      return onExp(L.desugarCond(exp.condLines, exp.meta))
    }

    case "Tael": {
      return onExp(L.desugarTael(exp.elements, exp.attributes, exp.meta))
    }

    case "Set": {
      return onExp(L.desugarSet(exp.elements, exp.meta))
    }

    case "Hash": {
      return onExp(L.desugarHash(exp.entries, exp.meta))
    }

    case "Quote": {
      return onExp(L.desugarQuote(exp.sexp, exp.meta))
    }

    default: {
      return L.expMap(onExp, exp)
    }
  }
}
