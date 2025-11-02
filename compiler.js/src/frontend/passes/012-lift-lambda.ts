import * as X from "@xieyuheng/x-sexp.js"
import { mapFlatMap } from "../../helpers/map/mapFlatMap.ts"
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
      const context = { lifted, functionName: definition.name }
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
  functionName: string
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

    // case "Lambda": {
    //   const freeNames = expFreeNames(new Set(), exp)
    //   const newBoundNames = setUnion(boundNames, new Set(exp.parameters))
    //   return Exps.Curry(
    //     exp.parameters,
    //     revealExp(mod, newBoundNames, exp.body),
    //     exp.meta,
    //   )
    // }

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
