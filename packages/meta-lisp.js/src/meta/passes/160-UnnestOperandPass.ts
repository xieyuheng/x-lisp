import { arrayUnzip } from "@xieyuheng/std.js/array"
import * as M from "../index.ts"

export function UnnestOperandPass(pkg: M.Package): void {
  for (const mod of pkg.mods.values()) {
    for (const definition of mod.definitions.values()) {
      unnestOperandDefinition(definition)
    }
  }

  if (pkg.config.compiler.dump) M.packageDumpMods(pkg, "160-unnest-operand")
}

type State = {
  freshNameCount: number
}

function unnestOperandDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "AlgebraicTypeDefinition":
    case "OpaqueTypeDefinition": {
      return null
    }

    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition":
    case "TypeDefinition": {
      const state = { freshNameCount: 0 }
      definition.body = unnestOperandTerm(state, definition.body)
      return null
    }
  }
}

function generateFreshName(state: State): string {
  state.freshNameCount++
  return `_.${state.freshNameCount}`
}

function unnestOperandTerm(state: State, term: M.Term): M.Term {
  switch (term.kind) {
    case "ApplyTerm": {
      const [targetEntries, newTarget] = unnestOperandAtom(state, term.target)
      const [argsEntriesArray, newArgs] = arrayUnzip(
        term.args.map((arg) => unnestOperandAtom(state, arg)),
      )
      const argsEntries = argsEntriesArray.flatMap((entries) => entries)
      return prependLets(
        [...targetEntries, ...argsEntries],
        M.ApplyTerm(newTarget, newArgs, term.location),
      )
    }

    default: {
      return M.termTraverse((e) => unnestOperandTerm(state, e), term)
    }
  }
}

function prependLets(entries: Array<Entry>, term: M.Term): M.Term {
  if (entries.length === 0) {
    return term
  }

  const [[name, rhs], ...restEntries] = entries
  if (name === null) {
    return M.Begin1Term(rhs, prependLets(restEntries, term), term.location)
  } else {
    return M.Let1Term(name, rhs, prependLets(restEntries, term), term.location)
  }
}

type Entry = [string | null, M.Term]

function unnestOperandAtom(state: State, term: M.Term): [Array<Entry>, M.Term] {
  switch (term.kind) {
    case "VarTerm":
    case "QualifiedVarTerm":
    case "SymbolTerm":
    case "KeywordTerm":
    case "StringTerm":
    case "IntTerm":
    case "FloatTerm": {
      return [[], term]
    }

    case "ApplyTerm": {
      const [targetEntries, newTarget] = unnestOperandAtom(state, term.target)
      const [argsEntriesArray, newArgs] = arrayUnzip(
        term.args.map((arg) => unnestOperandAtom(state, arg)),
      )
      const argsEntries = argsEntriesArray.flatMap((entries) => entries)
      const freshName = generateFreshName(state)
      const entry: Entry = [
        freshName,
        M.ApplyTerm(newTarget, newArgs, term.location),
      ]
      return [
        [...targetEntries, ...argsEntries, entry],
        M.VarTerm(freshName, term.location),
      ]
    }

    case "Let1Term": {
      const rhsEntry: Entry = [term.name, unnestOperandTerm(state, term.rhs)]
      const [bodyEntries, newBody] = unnestOperandAtom(state, term.body)
      return [[rhsEntry, ...bodyEntries], newBody]
    }

    case "Begin1Term": {
      const headEntry: Entry = [null, unnestOperandTerm(state, term.head)]
      const [bodyEntries, newBody] = unnestOperandAtom(state, term.body)
      return [[headEntry, ...bodyEntries], newBody]
    }

    default: {
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, unnestOperandTerm(state, term)]
      return [[entry], M.VarTerm(freshName, term.location)]
    }
  }
}
