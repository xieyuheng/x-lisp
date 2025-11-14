import * as S from "@xieyuheng/x-sexp.js"
import assert from "node:assert"
import { stringToSubscript } from "../../helpers/string/stringToSubscript.ts"
import * as Definitions from "../definition/index.ts"
import { type Definition } from "../definition/index.ts"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { modOwnDefinitions, type Mod } from "../mod/index.ts"
import { desugarApply } from "./005-ShrinkPass.ts"

export function LiftLambdaPass(mod: Mod): void {
  mod.definitions = new Map(
    modOwnDefinitions(mod)
      .flatMap((definition) => onDefinition(mod, definition))
      .map((definition) => [definition.name, definition]),
  )
}

type State = {
  mod: Mod
  lifted: Array<Definition>
  definition: Definitions.FunctionDefinition
}

function onDefinition(mod: Mod, definition: Definition): Array<Definition> {
  switch (definition.kind) {
    case "FunctionDefinition": {
      const lifted: Array<Definition> = []
      const state = { mod, lifted, definition }
      definition.body = onExp(state, definition.body)
      return [
        definition,
        ...lifted.flatMap((definition) => onDefinition(mod, definition)),
      ]
    }
  }
}

function onExp(state: State, exp: Exp): Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "FunctionRef":
    case "PrimitiveFunctionRef":
    case "Var": {
      return exp
    }

    case "Lambda": {
      const freeNames = Array.from(Exps.expFreeNames(new Set(), exp))
      const liftedCount = state.lifted.length + 1
      const subscript = stringToSubscript(liftedCount.toString())
      const newFunctionName = `${state.definition.name}/λ${subscript}`
      const newParameters = [...freeNames, ...exp.parameters]
      const arity = newParameters.length
      assert(exp.meta)
      state.lifted.push(
        Definitions.FunctionDefinition(
          state.mod,
          newFunctionName,
          newParameters,
          exp.body,
          exp.meta,
        ),
      )

      return makeCurry(
        Exps.FunctionRef(newFunctionName, arity),
        arity,
        freeNames.map((name) => Exps.Var(name)),
      )
    }

    case "Apply": {
      return Exps.Apply(
        onExp(state, exp.target),
        onExp(state, exp.arg),
        exp.meta,
      )
    }

    case "NullaryApply": {
      return Exps.NullaryApply(onExp(state, exp.target), exp.meta)
    }

    case "Let1": {
      return Exps.Let1(
        exp.name,
        onExp(state, exp.rhs),
        onExp(state, exp.body),
        exp.meta,
      )
    }

    case "If": {
      return Exps.If(
        onExp(state, exp.condition),
        onExp(state, exp.consequent),
        onExp(state, exp.alternative),
        exp.meta,
      )
    }

    default: {
      let message = `[LiftLambdaPass] unhandled exp`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}

function makeCurry(target: Exp, arity: number, args: Array<Exp>): Exp {
  let result = desugarApply(Exps.PrimitiveFunctionRef("make-curry", 3), [
    target,
    Exps.Int(arity),
    Exps.Int(args.length),
  ])

  for (const [index, arg] of args.entries()) {
    result = desugarApply(Exps.PrimitiveFunctionRef("curry-put!", 3), [
      Exps.Int(index),
      arg,
      result,
    ])
  }

  return result
}
