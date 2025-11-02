import * as X from "@xieyuheng/x-sexp.js"
import type { Definition } from "../definition/index.ts"
import * as Definitions from "../definition/index.ts"
import type { Exp } from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import {
  modFlatMapDefinitionEntry,
  type DefinitionEntry,
  type Mod,
} from "../mod/index.ts"

export function liftLambda(mod: Mod): Mod {
  return modFlatMapDefinitionEntry(mod, (entry) => liftDefinitionEntry(entry))
}

function liftDefinitionEntry([
  name,
  definition,
]: DefinitionEntry): Array<DefinitionEntry> {
  switch (definition.kind) {
    case "FunctionDefinition": {
      const lifted: Map<string, Definition> = new Map()
      return [
        [
          name,
          Definitions.FunctionDefinition(
            definition.name,
            definition.parameters,
            liftExp(lifted, definition.body),
            definition.meta,
          ),
        ],
        ...lifted.entries(),
      ]
    }
  }
}

function liftExp(lifted: Map<string, Definition>, exp: Exp): Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float": {
      return exp
    }

    // case "Var": {
    //   if (boundNames.has(exp.name)) {
    //     return exp
    //   }

    //   const builtinArity = getBuiltinFunctionArity(exp.name)
    //   if (builtinArity !== undefined) {
    //     return Exps.FunctionRef(exp.name, builtinArity, exp.meta)
    //   }

    //   const definition = modLookupDefinition(mod, exp.name)
    //   if (definition === undefined) {
    //     let message = `[reveal-function] undefined name`
    //     message += `\n  name: ${exp.name}`
    //     if (exp.meta) throw new X.ErrorWithMeta(message, exp.meta)
    //     else throw new Error(message)
    //   }

    //   if (definition.kind !== "FunctionDefinition") {
    //     let message = `[reveal-function] global name must be function for now`
    //     message += `\n  name: ${exp.name}`
    //     if (exp.meta) throw new X.ErrorWithMeta(message, exp.meta)
    //     else throw new Error(message)
    //   }

    //   const arity = definition.parameters.length
    //   return Exps.FunctionRef(exp.name, arity, exp.meta)
    // }

    // case "Lambda": {
    //   const newBoundNames = setUnion(boundNames, new Set(exp.parameters))
    //   return Exps.Lambda(
    //     exp.parameters,
    //     revealExp(mod, newBoundNames, exp.body),
    //     exp.meta,
    //   )
    // }

    // case "Apply": {
    //   return Exps.Apply(
    //     revealExp(mod, boundNames, exp.target),
    //     exp.args.map((e) => revealExp(mod, boundNames, e)),
    //     exp.meta,
    //   )
    // }

    // case "Begin": {
    //   return Exps.Begin(
    //     revealExp(mod, boundNames, exp.head),
    //     revealExp(mod, boundNames, exp.body),
    //     exp.meta,
    //   )
    // }

    // case "Let1": {
    //   const newBoundNames = setAdd(boundNames, exp.name)
    //   return Exps.Let1(
    //     exp.name,
    //     revealExp(mod, newBoundNames, exp.rhs),
    //     revealExp(mod, newBoundNames, exp.body),
    //     exp.meta,
    //   )
    // }

    // case "If": {
    //   return Exps.If(
    //     revealExp(mod, boundNames, exp.condition),
    //     revealExp(mod, boundNames, exp.consequent),
    //     revealExp(mod, boundNames, exp.alternative),
    //     exp.meta,
    //   )
    // }

    default: {
      let message = `[lift-lambda] unhandled exp`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new X.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}
