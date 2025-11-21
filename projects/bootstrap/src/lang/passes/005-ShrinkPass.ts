import * as S from "@xieyuheng/x-sexp.js"
import { type Definition } from "../definition/index.ts"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { modOwnDefinitions, type Mod } from "../mod/index.ts"

export function ShrinkPass(mod: Mod): void {
  for (const definition of modOwnDefinitions(mod)) {
    onDefinition(definition)
  }
}

function onDefinition(definition: Definition): null {
  switch (definition.kind) {
    case "FunctionDefinition": {
      definition.body = onExp(definition.body)
      return null
    }
  }
}

function onExp(exp: Exp): Exp {
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
      return Exps.Lambda(exp.parameters, onExp(exp.body), exp.meta)
    }

    case "ApplySugar": {
      return Exps.desugarApply(
        onExp(exp.target),
        exp.args.map((e) => onExp(e)),
        exp.meta,
      )
    }

    case "Let1": {
      return Exps.Let1(exp.name, onExp(exp.rhs), onExp(exp.body), exp.meta)
    }

    case "BeginSugar": {
      if (exp.sequence.length === 0) {
        let message = `[shrink] (begin) must not be empty`
        message += `\n  exp: ${formatExp(exp)}`
        if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
        else throw new Error(message)
      }

      const [head, ...rest] = exp.sequence
      if (rest.length === 0) {
        return onExp(head)
      }

      const body = Exps.BeginSugar(rest, exp.meta)

      if (head.kind === "AssignSugar") {
        return Exps.Let1(head.name, onExp(head.rhs), onExp(body), exp.meta)
      } else {
        return Exps.Let1("_∅", onExp(head), onExp(body), head.meta)
      }
    }

    case "AssignSugar": {
      let message = `[shrink] (=) must occur be in head of (begin)`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }

    case "When": {
      return Exps.If(
        onExp(exp.condition),
        onExp(exp.consequent),
        Exps.Void(),
        exp.meta,
      )
    }

    case "Unless": {
      return Exps.If(
        onExp(exp.condition),
        Exps.Void(),
        onExp(exp.consequent),
        exp.meta,
      )
    }

    case "And": {
      return Exps.desugarAnd(exp.exps.map(onExp), exp.meta)
    }

    case "Or": {
      return Exps.desugarOr(exp.exps.map(onExp), exp.meta)
    }

    case "If": {
      return Exps.If(
        onExp(exp.condition),
        onExp(exp.consequent),
        onExp(exp.alternative),
        exp.meta,
      )
    }

    default: {
      let message = `[ShrinkPass] unhandled exp`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}
