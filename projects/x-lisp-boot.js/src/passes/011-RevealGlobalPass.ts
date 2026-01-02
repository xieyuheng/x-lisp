import { setAdd, setUnion } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"
import * as R from "../runtime/index.ts"

export function RevealGlobalPass(mod: L.Mod): void {
  for (const definition of L.modOwnDefinitions(mod)) {
    onDefinition(mod, definition)
  }
}

function onDefinition(mod: L.Mod, definition: L.Definition): null {
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

function revealGlobalVariable(mod: L.Mod, variable: L.Var): L.Exp {
  const builtinArity = R.getBuiltinFunctionArity(variable.name)
  if (builtinArity !== undefined) {
    return L.FunctionRef(
      variable.name,
      builtinArity,
      { isPrimitive: true },
      variable.meta,
    )
  }

  const definition = L.modLookupDefinition(mod, variable.name)
  if (definition === undefined) {
    let message = `[RevealGlobalPass] [revealGlobalVariable] undefined name`
    message += `\n  variable name: ${variable.name}`
    if (variable.meta) throw new S.ErrorWithMeta(message, variable.meta)
    else throw new Error(message)
  }

  switch (definition.kind) {
    case "FunctionDefinition": {
      const arity = definition.parameters.length
      return L.FunctionRef(
        variable.name,
        arity,
        { isPrimitive: false },
        variable.meta,
      )
    }

    case "ConstantDefinition": {
      return L.ConstantRef(variable.name, { isPrimitive: false }, variable.meta)
    }
  }
}

function onExp(mod: L.Mod, boundNames: Set<string>, exp: L.Exp): L.Exp {
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

      return revealGlobalVariable(mod, exp)
    }

    case "Lambda": {
      const newBoundNames = setUnion(boundNames, new Set(exp.parameters))
      return L.Lambda(
        exp.parameters,
        onExp(mod, newBoundNames, exp.body),
        exp.meta,
      )
    }

    case "ApplyNullary": {
      return L.ApplyNullary(onExp(mod, boundNames, exp.target), exp.meta)
    }

    case "Apply": {
      return L.Apply(
        onExp(mod, boundNames, exp.target),
        onExp(mod, boundNames, exp.arg),
        exp.meta,
      )
    }

    case "Let1": {
      const newBoundNames = setAdd(boundNames, exp.name)
      return L.Let1(
        exp.name,
        onExp(mod, newBoundNames, exp.rhs),
        onExp(mod, newBoundNames, exp.body),
        exp.meta,
      )
    }

    case "If": {
      return L.If(
        onExp(mod, boundNames, exp.condition),
        onExp(mod, boundNames, exp.consequent),
        onExp(mod, boundNames, exp.alternative),
        exp.meta,
      )
    }

    default: {
      let message = `[RevealGlobalPass] unhandled exp`
      message += `\n  exp: ${L.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}
