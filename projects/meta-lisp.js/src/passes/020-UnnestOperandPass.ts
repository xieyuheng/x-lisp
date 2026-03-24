import { arrayUnzip } from "@xieyuheng/helpers.js/array"
import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as M from "../meta/index.ts"

export function UnnestOperandPass(mod: M.Mod): void {
  for (const definition of M.modOwnDefinitions(mod)) {
    onDefinition(definition)
  }
}

type State = {
  freshNameCount: number
}

function onDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition":
    case "DataDefinition":
    case "InterfaceDefinition": {
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

function onExp(state: State, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "Require": {
      return exp
    }

    case "Var": {
      return exp
    }

    case "Symbol":
    case "Keyword":
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
        M.Apply(newTarget, newArgs, exp.meta),
      )
    }

    default: {
      return M.expTraverse((e) => onExp(state, e), exp)
    }
  }
}

function prependLets(entries: Array<Entry>, exp: M.Exp): M.Exp {
  if (entries.length === 0) {
    return exp
  }

  const [[name, rhs], ...restEntries] = entries
  if (name === null) {
    return M.Begin1(rhs, prependLets(restEntries, exp))
  } else {
    return M.Let1(name, rhs, prependLets(restEntries, exp))
  }
}

type Entry = [string | null, M.Exp]

function forAtom(state: State, exp: M.Exp): [Array<Entry>, M.Exp] {
  switch (exp.kind) {
    case "Var":
    case "Symbol":
    case "Keyword":
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
      const entry: Entry = [freshName, M.Apply(newTarget, newArgs, exp.meta)]
      return [
        [...targetEntries, ...argsEntries, entry],
        M.Var(freshName, exp.meta),
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
      return [[entry], M.Var(freshName, exp.meta)]
    }
  }
}
