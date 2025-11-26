import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as S from "@xieyuheng/sexp.js"
import * as X from "../index.ts"

export function UnnestOperandPass(mod: X.Mod): void {
  for (const definition of X.modOwnDefinitions(mod)) {
    onDefinition(definition)
  }
}

type State = {
  freshNameCount: number
}

function onDefinition(definition: X.Definition): null {
  switch (definition.kind) {
    case "FunctionDefinition":
    case "ConstantDefinition": {
      const state = { freshNameCount: 0 }
      definition.body = onExp(state, definition.body)
      return null
    }
  }
}

function generateFreshName(state: State): string {
  state.freshNameCount++
  const subscript = stringToSubscript(state.freshNameCount.toString())
  return `_${subscript}`
}

function onExp(state: State, exp: X.Exp): X.Exp {
  switch (exp.kind) {
    case "Var": {
      return exp
    }

    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float": {
      return exp
    }

    case "Function":
    case "Constant": {
      const [entries, newExp] = forVar(state, exp)
      return prependLets(entries, newExp)
    }

    case "ApplyNullary": {
      const [targetEntries, newTarget] = forVar(state, exp.target)
      return prependLets(targetEntries, X.ApplyNullary(newTarget, exp.meta))
    }

    case "Apply": {
      const [targetEntries, newTarget] = forVar(state, exp.target)
      const [argEntries, newArg] = forVar(state, exp.arg)
      return prependLets(
        [...targetEntries, ...argEntries],
        X.Apply(newTarget, newArg, exp.meta),
      )
    }

    case "If": {
      const [conditionEntries, newCondition] = forVar(state, exp.condition)
      return prependLets(
        conditionEntries,
        X.If(
          newCondition,
          onExp(state, exp.consequent),
          onExp(state, exp.alternative),
          exp.meta,
        ),
      )
    }

    case "Let1": {
      return X.Let1(
        exp.name,
        onExp(state, exp.rhs),
        onExp(state, exp.body),
        exp.meta,
      )
    }

    default: {
      let message = `[UnnestOperandPass] unhandled exp`
      message += `\n  exp: ${X.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}

function prependLets(entries: Array<Entry>, exp: X.Exp): X.Exp {
  if (entries.length === 0) {
    return exp
  }

  const [[name, rhs], ...restEntries] = entries
  return X.Let1(name, rhs, prependLets(restEntries, exp))
}

type Entry = [string, X.Exp]

function forVar(state: State, exp: X.Exp): [Array<Entry>, X.Exp] {
  switch (exp.kind) {
    case "Var": {
      return [[], exp]
    }

    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "Function":
    case "Constant": {
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, exp]
      return [[entry], X.Var(freshName, exp.meta)]
    }

    case "ApplyNullary": {
      const [targetEntries, newTarget] = forVar(state, exp.target)
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, X.ApplyNullary(newTarget, exp.meta)]
      return [[...targetEntries, entry], X.Var(freshName, exp.meta)]
    }

    case "Apply": {
      const [targetEntries, newTarget] = forVar(state, exp.target)
      const [argEntries, newArg] = forVar(state, exp.arg)
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, X.Apply(newTarget, newArg, exp.meta)]
      return [
        [...targetEntries, ...argEntries, entry],
        X.Var(freshName, exp.meta),
      ]
    }

    case "Let1": {
      const rhsEntry: Entry = [exp.name, onExp(state, exp.rhs)]
      const [bodyEntries, newBody] = forVar(state, exp.body)
      return [[rhsEntry, ...bodyEntries], newBody]
    }

    case "If": {
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, onExp(state, exp)]
      return [[entry], X.Var(freshName, exp.meta)]
    }

    default: {
      let message = `[UnnestOperandPass] unhandled exp`
      message += `\n  exp: ${X.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}
