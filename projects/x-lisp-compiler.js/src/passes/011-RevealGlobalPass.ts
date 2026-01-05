import { setAdd, setUnion } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../lisp/index.ts"

export function RevealGlobalPass(mod: L.Mod): void {
  for (const definition of L.modOwnDefinitions(mod)) {
    onDefinition(mod, definition)
  }
}

function onDefinition(mod: L.Mod, definition: L.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition":
    case "PrimitiveConstantDefinition": {
      return null
    }

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
  const definition = L.modLookupDefinition(mod, variable.name)
  if (definition === undefined) {
    let message = `[RevealGlobalPass] [revealGlobalVariable] undefined name`
    message += `\n  variable name: ${variable.name}`
    if (variable.meta) throw new S.ErrorWithMeta(message, variable.meta)
    else throw new Error(message)
  }

  switch (definition.kind) {
    case "PrimitiveFunctionDefinition": {
      return L.PrimitiveFunctionRef(variable.name, definition.arity, variable.meta)
    }

    case "PrimitiveConstantDefinition": {
      return L.PrimitiveConstantRef(variable.name, variable.meta)
    }

    case "FunctionDefinition": {
      const arity = definition.parameters.length
      return L.FunctionRef(variable.name, arity, variable.meta)
    }


    case "ConstantDefinition": {
      return L.ConstantRef(variable.name, variable.meta)
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

    case "Apply": {
      return L.Apply(
        onExp(mod, boundNames, exp.target),
        exp.args.map((arg) => onExp(mod, boundNames, arg)),
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

    case "Begin1": {
      return L.Begin1(
        onExp(mod, boundNames, exp.head),
        onExp(mod, boundNames, exp.body),
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
