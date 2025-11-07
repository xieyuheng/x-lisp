import * as S from "@xieyuheng/x-sexp.js"
import assert from "node:assert"
import { mapFlatMap } from "../../helpers/map/mapFlatMap.ts"
import { stringToSubscript } from "../../helpers/string/stringToSubscript.ts"
import * as Definitions from "../definition/index.ts"
import { type Definition } from "../definition/index.ts"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import {
  modFlatMapDefinitionEntry,
  type DefinitionEntry,
  type Mod,
} from "../mod/index.ts"

export function LiftLambdaPass(mod: Mod): Mod {
  return modFlatMapDefinitionEntry(mod, onDefinitionEntry)
}

type State = {
  lifted: Map<string, Definition>
  definition: Definitions.FunctionDefinition
}

function onDefinitionEntry([
  name,
  definition,
]: DefinitionEntry): Array<DefinitionEntry> {
  switch (definition.kind) {
    case "FunctionDefinition": {
      const lifted: Map<string, Definition> = new Map()
      const state = { lifted, definition }
      const newBody = onExp(state, definition.body)
      const newDefinition = Definitions.FunctionDefinition(
        definition.name,
        definition.parameters,
        newBody,
        definition.meta,
      )
      return [
        [name, newDefinition],
        ...mapFlatMap(lifted, onDefinitionEntry).entries(),
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
    case "Var": {
      return exp
    }

    case "Lambda": {
      const freeNames = Array.from(Exps.expFreeNames(new Set(), exp))
      const liftedCount = state.lifted.size + 1
      const subscript = stringToSubscript(liftedCount.toString())
      const newFunctionName = `${state.definition.name}/λ${subscript}`
      const newParameters = [...freeNames, ...exp.parameters]
      const arity = newParameters.length
      assert(exp.meta)
      const newDefinition = Definitions.FunctionDefinition(
        newFunctionName,
        newParameters,
        exp.body,
        exp.meta,
      )
      state.lifted.set(newFunctionName, newDefinition)

      return makeCurry(
        Exps.FunctionRef(newFunctionName, arity),
        arity,
        freeNames.map((name) => Exps.Var(name)),
      )
    }

    case "Apply": {
      return Exps.Apply(
        onExp(state, exp.target),
        exp.args.map((e) => onExp(state, e)),
        exp.meta,
      )
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
  let result = Exps.Apply(Exps.FunctionRef("make-curry", 3), [
    target,
    Exps.Int(arity),
    Exps.Int(args.length),
  ])

  for (const [index, arg] of args.entries()) {
    result = Exps.Apply(Exps.FunctionRef("curry-put!", 3), [
      Exps.Int(index),
      arg,
      result,
    ])
  }

  return result
}
