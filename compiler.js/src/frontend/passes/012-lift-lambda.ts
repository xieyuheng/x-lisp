import * as X from "@xieyuheng/x-sexp.js"
import assert from "node:assert"
import { mapFlatMap } from "../../helpers/map/mapFlatMap.ts"
import { stringToSubscript } from "../../helpers/string/stringToSubscript.ts"
import type { Definition } from "../definition/index.ts"
import * as Definitions from "../definition/index.ts"
import type { Exp } from "../exp/index.ts"
import * as Exps from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import {
  modFlatMapDefinitionEntry,
  type DefinitionEntry,
  type Mod,
} from "../mod/index.ts"

export function liftLambda(mod: Mod): Mod {
  return modFlatMapDefinitionEntry(mod, liftDefinitionEntry)
}

function liftDefinitionEntry([
  name,
  definition,
]: DefinitionEntry): Array<DefinitionEntry> {
  switch (definition.kind) {
    case "FunctionDefinition": {
      const lifted: Map<string, Definition> = new Map()
      const context = { lifted, definition }
      const newBody = liftExp(context, definition.body)
      const newDefinition = Definitions.FunctionDefinition(
        definition.name,
        definition.parameters,
        newBody,
        definition.meta,
      )
      return [
        [name, newDefinition],
        ...mapFlatMap(lifted, liftDefinitionEntry).entries(),
      ]
    }
  }
}

type Context = {
  lifted: Map<string, Definition>
  definition: Definitions.FunctionDefinition
}

function liftExp(context: Context, exp: Exp): Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float": {
      return exp
    }

    case "Var":
    case "FunctionRef": {
      return exp
    }

    case "Lambda": {
      const freeNames = Array.from(Exps.expFreeNames(new Set(), exp))
      const subscript = stringToSubscript(context.lifted.size.toString())
      const newFunctionName = `${context.definition.name}/lambda${subscript}`
      const newParameters = [...freeNames, ...exp.parameters]
      const arity = newParameters.length
      assert(exp.meta)
      const newDefinition = Definitions.FunctionDefinition(
        newFunctionName,
        newParameters,
        exp.body,
        exp.meta,
      )
      context.lifted.set(newFunctionName, newDefinition)

      const freeVariables = freeNames.map((name) => Exps.Var(name))
      return Exps.Curry(
        Exps.FunctionRef(newFunctionName, arity),
        arity,
        freeVariables,
        exp.meta,
      )
    }

    case "Apply": {
      return Exps.Apply(
        liftExp(context, exp.target),
        exp.args.map((e) => liftExp(context, e)),
        exp.meta,
      )
    }

    case "Begin": {
      return Exps.Begin(
        liftExp(context, exp.head),
        liftExp(context, exp.body),
        exp.meta,
      )
    }

    case "Let1": {
      return Exps.Let1(
        exp.name,
        liftExp(context, exp.rhs),
        liftExp(context, exp.body),
        exp.meta,
      )
    }

    case "If": {
      return Exps.If(
        liftExp(context, exp.condition),
        liftExp(context, exp.consequent),
        liftExp(context, exp.alternative),
        exp.meta,
      )
    }

    default: {
      let message = `[lift-lambda] unhandled exp`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new X.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}
