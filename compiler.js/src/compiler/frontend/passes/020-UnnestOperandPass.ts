import * as X from "@xieyuheng/x-sexp.js"
import { arrayConcat } from "../../../helpers/array/arrayConcat.ts"
import { arrayUnzip } from "../../../helpers/array/arrayUnzip.ts"
import { stringToSubscript } from "../../../helpers/string/stringToSubscript.ts"
import * as Definitions from "../definition/index.ts"
import { type Definition } from "../definition/index.ts"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { modMapDefinition, type Mod } from "../mod/index.ts"

export function UnnestOperandPass(mod: Mod): Mod {
  return modMapDefinition(mod, (definition) => unnestDefinition(definition))
}

type State = {
  freshNameCount: number
}

function unnestDefinition(definition: Definition): Definition {
  switch (definition.kind) {
    case "FunctionDefinition": {
      const state = { freshNameCount: 0 }
      return Definitions.FunctionDefinition(
        definition.name,
        definition.parameters,
        unnestExp(state, definition.body),
        definition.meta,
      )
    }
  }
}

function generateFreshName(state: State): string {
  state.freshNameCount++
  const subscript = stringToSubscript(state.freshNameCount.toString())
  return `_${subscript}`
}

function unnestExp(state: State, exp: Exp): Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float": {
      return exp
    }

    case "FunctionRef":
    case "Var": {
      return exp
    }

    case "Curry": {
      const [targetEntries, newTarget] = unnestAtom(state, exp.target)
      const [argEntries, newArgs] = unnestAtomMany(state, exp.args)
      return prependLets(
        [...targetEntries, ...argEntries],
        Exps.Curry(newTarget, exp.arity, newArgs, exp.meta),
      )
    }

    case "Apply": {
      const [targetEntries, newTarget] = unnestAtom(state, exp.target)
      const [argEntries, newArgs] = unnestAtomMany(state, exp.args)
      return prependLets(
        [...targetEntries, ...argEntries],
        Exps.Apply(newTarget, newArgs, exp.meta),
      )
    }

    case "Begin": {
      return Exps.Begin(
        unnestExp(state, exp.head),
        unnestExp(state, exp.body),
        exp.meta,
      )
    }

    case "Let1": {
      return Exps.Let1(
        exp.name,
        unnestExp(state, exp.rhs),
        unnestExp(state, exp.body),
        exp.meta,
      )
    }

    case "If": {
      return Exps.If(
        unnestExp(state, exp.condition),
        unnestExp(state, exp.consequent),
        unnestExp(state, exp.alternative),
        exp.meta,
      )
    }

    default: {
      let message = `[UnnestOperandPass] unhandled exp`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new X.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}

function prependLets(entries: Array<Entry>, exp: Exp): Exp {
  if (entries.length === 0) {
    return exp
  }

  const [[name, rhs], ...restEntries] = entries
  return Exps.Let1(name, rhs, prependLets(restEntries, exp))
}

type Entry = [string, Exp]

function unnestAtom(state: State, exp: Exp): [Array<Entry>, Exp] {
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
    case "Begin":
    case "If": {
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, unnestExp(state, exp)]
      return [[entry], Exps.Var(freshName, exp.meta)]
    }

    case "Curry": {
      const [targetEntries, newTarget] = unnestAtom(state, exp.target)
      const [argEntries, newArgs] = unnestAtomMany(state, exp.args)
      const freshName = generateFreshName(state)
      const entry: Entry = [
        freshName,
        Exps.Curry(newTarget, exp.arity, newArgs, exp.meta),
      ]
      return [
        [...targetEntries, ...argEntries, entry],
        Exps.Var(freshName, exp.meta),
      ]
    }

    case "Apply": {
      const [targetEntries, newTarget] = unnestAtom(state, exp.target)
      const [argEntries, newArgs] = unnestAtomMany(state, exp.args)
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, Exps.Apply(newTarget, newArgs, exp.meta)]
      return [
        [...targetEntries, ...argEntries, entry],
        Exps.Var(freshName, exp.meta),
      ]
    }

    case "Let1": {
      const rhsEntry: Entry = [exp.name, unnestExp(state, exp.rhs)]
      const [bodyEntries, newBody] = unnestAtom(state, exp.body)
      return [[rhsEntry, ...bodyEntries], newBody]
    }

    default: {
      let message = `[unnestAtom] unhandled exp`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new X.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}

function unnestAtomMany(
  state: State,
  exps: Array<Exp>,
): [Array<Entry>, Array<Exp>] {
  const [entriesArray, newExps] = arrayUnzip(
    exps.map((e) => unnestAtom(state, e)),
  )
  return [arrayConcat(entriesArray), newExps]
}
