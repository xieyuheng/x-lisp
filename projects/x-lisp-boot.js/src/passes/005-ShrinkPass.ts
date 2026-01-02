import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"

export function ShrinkPass(mod: L.Mod): void {
  for (const definition of L.modOwnDefinitions(mod)) {
    onDefinition(definition)
  }
}

function onDefinition(definition: L.Definition): null {
  switch (definition.kind) {
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
    case "Float": {
      return exp
    }

    case "Var": {
      return exp
    }

    case "Lambda": {
      return L.Lambda(exp.parameters, onExp(exp.body), exp.meta)
    }

    case "ApplySugar": {
      return L.desugarApply(
        onExp(exp.target),
        exp.args.map((e) => onExp(e)),
        exp.meta,
      )
    }

    case "Let1": {
      return L.Let1(exp.name, onExp(exp.rhs), onExp(exp.body), exp.meta)
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
        return L.Let1("_∅", onExp(head), onExp(body), head.meta)
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
      return L.desugarAnd(exp.exps.map(onExp), exp.meta)
    }

    case "Or": {
      return L.desugarOr(exp.exps.map(onExp), exp.meta)
    }

    case "If": {
      return L.If(
        onExp(exp.condition),
        onExp(exp.consequent),
        onExp(exp.alternative),
        exp.meta,
      )
    }

    default: {
      let message = `[ShrinkPass] unhandled exp`
      message += `\n  exp: ${L.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}
