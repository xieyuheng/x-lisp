import * as X from "@xieyuheng/x-sexp.js"
import type { Definition } from "../definition/index.ts"
import * as Definitions from "../definition/index.ts"
import type { Exp } from "../exp/index.ts"
import * as Exps from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { modMapDefinition, type Mod } from "../mod/index.ts"

export function shrink(mod: Mod): Mod {
  return modMapDefinition(mod, shrinkDefinition)
}

function shrinkDefinition(definition: Definition): Definition {
  switch (definition.kind) {
    case "FunctionDefinition": {
      return Definitions.FunctionDefinition(
        definition.name,
        definition.parameters,
        shrinkExp(definition.body),
        definition.meta,
      )
    }
  }
}

function shrinkExp(exp: Exp): Exp {
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
      return Exps.Lambda(exp.parameters, shrinkExp(exp.body), exp.meta)
    }

    case "Apply": {
      return Exps.Apply(
        shrinkExp(exp.target),
        exp.args.map((arg) => shrinkExp(arg)),
        exp.meta,
      )
    }

    case "Begin": {
      return Exps.Begin(shrinkExp(exp.head), shrinkExp(exp.body), exp.meta)
    }

    case "Let": {
      return Exps.Let(
        exp.name,
        shrinkExp(exp.rhs),
        shrinkExp(exp.body),
        exp.meta,
      )
    }

    case "BeginSugar": {
      if (exp.sequence.length === 0) {
        let message = `[shrink] (begin) must not be empty`
        message += `\n  exp: ${formatExp(exp)}`
        if (exp.meta) throw new X.ErrorWithMeta(message, exp.meta)
        else throw new Error(message)
      }

      const [head, ...rest] = exp.sequence
      if (rest.length === 0) {
        return shrinkExp(head)
      }

      const body = Exps.BeginSugar(rest, exp.meta)

      if (head.kind === "AssignSugar") {
        return Exps.Let(
          head.name,
          shrinkExp(head.rhs),
          shrinkExp(body),
          exp.meta,
        )
      } else {
        return Exps.Begin(shrinkExp(head), shrinkExp(body), head.meta)
      }
    }

    case "AssignSugar": {
      let message = `[shrink] (=) must occur be in head of (begin)`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new X.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }

    case "If": {
      return Exps.If(
        shrinkExp(exp.condition),
        shrinkExp(exp.consequent),
        shrinkExp(exp.alternative),
        exp.meta,
      )
    }
  }
}
