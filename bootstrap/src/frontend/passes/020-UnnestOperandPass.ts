import * as S from "@xieyuheng/x-sexp.js"
import { arrayConcat } from "../../helpers/array/arrayConcat.ts"
import { arrayUnzip } from "../../helpers/array/arrayUnzip.ts"
import { stringToSubscript } from "../../helpers/string/stringToSubscript.ts"
import * as Definitions from "../definition/index.ts"
import { type Definition } from "../definition/index.ts"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { modMapDefinition, type Mod } from "../mod/index.ts"

export function UnnestOperandPass(mod: Mod): Mod {
  return modMapDefinition(mod, (definition) => onDefinition(definition))
}

type State = {
  freshNameCount: number
}

function onDefinition(definition: Definition): Definition {
  switch (definition.kind) {
    case "FunctionDefinition": {
      const state = { freshNameCount: 0 }
      return Definitions.FunctionDefinition(
        definition.name,
        definition.parameters,
        onExp(state, definition.body),
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

function onExp(state: State, exp: Exp): Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float":
    case "FunctionRef":
    case "Var": {
      return exp
    }

    case "Apply": {
      const [targetEntries, newTarget] = forAtom(state, exp.target)
      const [argEntries, newArgs] = forAtomMany(state, exp.args)
      return prependLets(
        [...targetEntries, ...argEntries],
        Exps.Apply(newTarget, newArgs, exp.meta),
      )
    }

    case "If": {
      const [conditionEntries, newCondition] = forAtom(state, exp.condition)
      return prependLets(
        conditionEntries,
        Exps.If(
          newCondition,
          onExp(state, exp.consequent),
          onExp(state, exp.alternative),
          exp.meta,
        ),
      )
    }

    case "Let1": {
      return Exps.Let1(
        exp.name,
        onExp(state, exp.rhs),
        onExp(state, exp.body),
        exp.meta,
      )
    }

    default: {
      let message = `[UnnestOperandPass] unhandled exp`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
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

function forAtom(state: State, exp: Exp): [Array<Entry>, Exp] {
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
    case "If": {
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, onExp(state, exp)]
      return [[entry], Exps.Var(freshName, exp.meta)]
    }

    case "Apply": {
      const [targetEntries, newTarget] = forAtom(state, exp.target)
      const [argEntries, newArgs] = forAtomMany(state, exp.args)
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, Exps.Apply(newTarget, newArgs, exp.meta)]
      return [
        [...targetEntries, ...argEntries, entry],
        Exps.Var(freshName, exp.meta),
      ]
    }

    case "Let1": {
      const rhsEntry: Entry = [exp.name, onExp(state, exp.rhs)]
      const [bodyEntries, newBody] = forAtom(state, exp.body)
      return [[rhsEntry, ...bodyEntries], newBody]
    }

    default: {
      let message = `[unnestAtom] unhandled exp`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}

function forAtomMany(
  state: State,
  exps: Array<Exp>,
): [Array<Entry>, Array<Exp>] {
  const [entriesArray, newExps] = arrayUnzip(exps.map((e) => forAtom(state, e)))
  return [arrayConcat(entriesArray), newExps]
}
