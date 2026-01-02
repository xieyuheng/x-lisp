import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"

export function UnnestOperandPass(mod: L.Mod): void {
  for (const definition of L.modOwnDefinitions(mod)) {
    onDefinition(definition)
  }
}

type State = {
  freshNameCount: number
}

function onDefinition(definition: L.Definition): null {
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

function onExp(state: State, exp: L.Exp): L.Exp {
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

    case "FunctionRef":
    case "ConstantRef": {
      const [entries, newExp] = forVar(state, exp)
      return prependLets(entries, newExp)
    }

    case "ApplyNullary": {
      const [targetEntries, newTarget] = forVar(state, exp.target)
      return prependLets(targetEntries, L.ApplyNullary(newTarget, exp.meta))
    }

    case "Apply": {
      const [targetEntries, newTarget] = forVar(state, exp.target)
      const [argEntries, newArg] = forVar(state, exp.arg)
      return prependLets(
        [...targetEntries, ...argEntries],
        L.Apply(newTarget, newArg, exp.meta),
      )
    }

    case "If": {
      const [conditionEntries, newCondition] = forVar(state, exp.condition)
      return prependLets(
        conditionEntries,
        L.If(
          newCondition,
          onExp(state, exp.consequent),
          onExp(state, exp.alternative),
          exp.meta,
        ),
      )
    }

    case "Let1": {
      return L.Let1(
        exp.name,
        onExp(state, exp.rhs),
        onExp(state, exp.body),
        exp.meta,
      )
    }

    default: {
      let message = `[UnnestOperandPass] unhandled exp`
      message += `\n  exp: ${L.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}

function prependLets(entries: Array<Entry>, exp: L.Exp): L.Exp {
  if (entries.length === 0) {
    return exp
  }

  const [[name, rhs], ...restEntries] = entries
  return L.Let1(name, rhs, prependLets(restEntries, exp))
}

type Entry = [string, L.Exp]

function forVar(state: State, exp: L.Exp): [Array<Entry>, L.Exp] {
  switch (exp.kind) {
    case "Var": {
      return [[], exp]
    }

    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "FunctionRef":
    case "ConstantRef": {
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, exp]
      return [[entry], L.Var(freshName, exp.meta)]
    }

    case "ApplyNullary": {
      const [targetEntries, newTarget] = forVar(state, exp.target)
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, L.ApplyNullary(newTarget, exp.meta)]
      return [[...targetEntries, entry], L.Var(freshName, exp.meta)]
    }

    case "Apply": {
      const [targetEntries, newTarget] = forVar(state, exp.target)
      const [argEntries, newArg] = forVar(state, exp.arg)
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, L.Apply(newTarget, newArg, exp.meta)]
      return [
        [...targetEntries, ...argEntries, entry],
        L.Var(freshName, exp.meta),
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
      return [[entry], L.Var(freshName, exp.meta)]
    }

    default: {
      let message = `[UnnestOperandPass] unhandled exp`
      message += `\n  exp: ${L.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}
