import * as S from "@xieyuheng/sexp.js"
import * as X from "../index.ts"

export function ShrinkPass(mod: X.Mod): void {
  for (const definition of X.modOwnDefinitions(mod)) {
    onDefinition(definition)
  }
}

function onDefinition(definition: X.Definition): null {
  switch (definition.kind) {
    case "FunctionDefinition": {
      definition.body = onExp(definition.body)
      return null
    }
  }
}

function onExp(exp: X.Exp): X.Exp {
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
      return X.Lambda(exp.parameters, onExp(exp.body), exp.meta)
    }

    case "ApplySugar": {
      return X.desugarApply(
        onExp(exp.target),
        exp.args.map((e) => onExp(e)),
        exp.meta,
      )
    }

    case "Let1": {
      return X.Let1(exp.name, onExp(exp.rhs), onExp(exp.body), exp.meta)
    }

    case "BeginSugar": {
      if (exp.sequence.length === 0) {
        let message = `[shrink] (begin) must not be empty`
        message += `\n  exp: ${X.formatExp(exp)}`
        if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
        else throw new Error(message)
      }

      const [head, ...rest] = exp.sequence
      if (rest.length === 0) {
        return onExp(head)
      }

      const body = X.BeginSugar(rest, exp.meta)

      if (head.kind === "AssignSugar") {
        return X.Let1(head.name, onExp(head.rhs), onExp(body), exp.meta)
      } else {
        return X.Let1("_∅", onExp(head), onExp(body), head.meta)
      }
    }

    case "AssignSugar": {
      let message = `[shrink] (=) must occur in the head of (begin)`
      message += `\n  exp: ${X.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }

    case "When": {
      return X.If(
        onExp(exp.condition),
        onExp(exp.consequent),
        X.Void(),
        exp.meta,
      )
    }

    case "Unless": {
      return X.If(
        onExp(exp.condition),
        X.Void(),
        onExp(exp.consequent),
        exp.meta,
      )
    }

    case "And": {
      return X.desugarAnd(exp.exps.map(onExp), exp.meta)
    }

    case "Or": {
      return X.desugarOr(exp.exps.map(onExp), exp.meta)
    }

    case "If": {
      return X.If(
        onExp(exp.condition),
        onExp(exp.consequent),
        onExp(exp.alternative),
        exp.meta,
      )
    }

    default: {
      let message = `[ShrinkPass] unhandled exp`
      message += `\n  exp: ${X.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}
