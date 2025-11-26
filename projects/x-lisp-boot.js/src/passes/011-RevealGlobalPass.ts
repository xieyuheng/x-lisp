import { setAdd, setUnion } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import * as X from "../index.ts"

export function RevealGlobalPass(mod: X.Mod): void {
  for (const definition of X.modOwnDefinitions(mod)) {
    onDefinition(mod, definition)
  }
}

function onDefinition(mod: X.Mod, definition: X.Definition): null {
  switch (definition.kind) {
    case "FunctionDefinition": {
      definition.body = onExp(
        mod,
        new Set(definition.parameters),
        definition.body,
      )
      return null
    }

    case "ConstantDefinition": {
      definition.body = onExp(mod, new Set(), definition.body)
      return null
    }
  }
}

function onExp(mod: X.Mod, boundNames: Set<string>, exp: X.Exp): X.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float": {
      return exp
    }

    case "Var": {
      if (boundNames.has(exp.name)) {
        return exp
      }

      const builtinArity = X.getBuiltinFunctionArity(exp.name)
      if (builtinArity !== undefined) {
        return X.Function(
          exp.name,
          builtinArity,
          { isPrimitive: true },
          exp.meta,
        )
      }

      const definition = X.modLookupDefinition(mod, exp.name)
      if (definition === undefined) {
        let message = `[reveal-function] undefined name`
        message += `\n  name: ${exp.name}`
        if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
        else throw new Error(message)
      }

      if (definition.kind !== "FunctionDefinition") {
        let message = `[reveal-function] global name must be function for now`
        message += `\n  name: ${exp.name}`
        if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
        else throw new Error(message)
      }

      const arity = definition.parameters.length
      return X.Function(exp.name, arity, { isPrimitive: false }, exp.meta)
    }

    case "Lambda": {
      const newBoundNames = setUnion(boundNames, new Set(exp.parameters))
      return X.Lambda(
        exp.parameters,
        onExp(mod, newBoundNames, exp.body),
        exp.meta,
      )
    }

    case "ApplyNullary": {
      return X.ApplyNullary(onExp(mod, boundNames, exp.target), exp.meta)
    }

    case "Apply": {
      return X.Apply(
        onExp(mod, boundNames, exp.target),
        onExp(mod, boundNames, exp.arg),
        exp.meta,
      )
    }

    case "Let1": {
      const newBoundNames = setAdd(boundNames, exp.name)
      return X.Let1(
        exp.name,
        onExp(mod, newBoundNames, exp.rhs),
        onExp(mod, newBoundNames, exp.body),
        exp.meta,
      )
    }

    case "If": {
      return X.If(
        onExp(mod, boundNames, exp.condition),
        onExp(mod, boundNames, exp.consequent),
        onExp(mod, boundNames, exp.alternative),
        exp.meta,
      )
    }

    default: {
      let message = `[RevealGlobalPass] unhandled exp`
      message += `\n  exp: ${X.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}
