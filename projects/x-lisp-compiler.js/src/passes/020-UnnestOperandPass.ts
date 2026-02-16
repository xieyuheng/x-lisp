import { arrayUnzip } from "@xieyuheng/helpers.js/array"
import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as L from "../lisp/index.ts"

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
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      return null
    }

    case "FunctionDefinition":
    case "VariableDefinition": {
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

    case "Apply": {
      const [targetEntries, newTarget] = forAtom(state, exp.target)
      const [argsEntriesArray, newArgs] = arrayUnzip(
        exp.args.map((arg) => forAtom(state, arg)),
      )
      const argsEntries = argsEntriesArray.flatMap((entries) => entries)
      return prependLets(
        [...targetEntries, ...argsEntries],
        L.Apply(newTarget, newArgs, exp.meta),
      )
    }

    default: {
      return L.expMap((e) => onExp(state, e), exp)
    }
  }
}

function prependLets(entries: Array<Entry>, exp: L.Exp): L.Exp {
  if (entries.length === 0) {
    return exp
  }

  const [[name, rhs], ...restEntries] = entries
  if (name === null) {
    return L.Begin1(rhs, prependLets(restEntries, exp))
  } else {
    return L.Let1(name, rhs, prependLets(restEntries, exp))
  }
}

type Entry = [string | null, L.Exp]

function forAtom(state: State, exp: L.Exp): [Array<Entry>, L.Exp] {
  switch (exp.kind) {
    case "Var":
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float": {
      return [[], exp]
    }

    case "Apply": {
      const [targetEntries, newTarget] = forAtom(state, exp.target)
      const [argsEntriesArray, newArgs] = arrayUnzip(
        exp.args.map((arg) => forAtom(state, arg)),
      )
      const argsEntries = argsEntriesArray.flatMap((entries) => entries)
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, L.Apply(newTarget, newArgs, exp.meta)]
      return [
        [...targetEntries, ...argsEntries, entry],
        L.Var(freshName, exp.meta),
      ]
    }

    case "Let1": {
      const rhsEntry: Entry = [exp.name, onExp(state, exp.rhs)]
      const [bodyEntries, newBody] = forAtom(state, exp.body)
      return [[rhsEntry, ...bodyEntries], newBody]
    }

    case "Begin1": {
      const headEntry: Entry = [null, onExp(state, exp.head)]
      const [bodyEntries, newBody] = forAtom(state, exp.body)
      return [[headEntry, ...bodyEntries], newBody]
    }

    default: {
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, onExp(state, exp)]
      return [[entry], L.Var(freshName, exp.meta)]
    }
  }
}
