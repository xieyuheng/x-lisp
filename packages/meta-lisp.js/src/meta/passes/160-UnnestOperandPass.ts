import { arrayUnzip } from "@xieyuheng/helpers.js/array"
import * as M from "../index.ts"

export function UnnestOperandPass(pkg: M.Package): void {
  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const mod of orderedPkg.mods.values()) {
      for (const definition of mod.definitions.values()) {
        unnestOperandDefinition(definition)
      }
    }
  }

  if (pkg.config.compiler.dump)
    M.packageDumpMods(pkg, "160-unnest-operand")
}

type State = {
  freshNameCount: number
}

function unnestOperandDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition":
    case "AlgebraicTypeDefinition":
    case "OpaqueTypeDefinition": {
      return null
    }

    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition":
    case "TypeDefinition": {
      const state = { freshNameCount: 0 }
      definition.body = unnestOperandExp(state, definition.body)
      return null
    }
  }
}

function generateFreshName(state: State): string {
  state.freshNameCount++
  return `_.${state.freshNameCount}`
}

function unnestOperandExp(state: State, exp: M.Term): M.Term {
  switch (exp.kind) {
    case "ApplyTerm": {
      const [targetEntries, newTarget] = unnestOperandAtom(state, exp.target)
      const [argsEntriesArray, newArgs] = arrayUnzip(
        exp.args.map((arg) => unnestOperandAtom(state, arg)),
      )
      const argsEntries = argsEntriesArray.flatMap((entries) => entries)
      return prependLets(
        [...targetEntries, ...argsEntries],
        M.ApplyTerm(newTarget, newArgs, exp.location),
      )
    }

    default: {
      return M.termTraverse((e) => unnestOperandExp(state, e), exp)
    }
  }
}

function prependLets(entries: Array<Entry>, exp: M.Term): M.Term {
  if (entries.length === 0) {
    return exp
  }

  const [[name, rhs], ...restEntries] = entries
  if (name === null) {
    return M.Begin1Term(rhs, prependLets(restEntries, exp), exp.location)
  } else {
    return M.Let1Term(name, rhs, prependLets(restEntries, exp), exp.location)
  }
}

type Entry = [string | null, M.Term]

function unnestOperandAtom(state: State, exp: M.Term): [Array<Entry>, M.Term] {
  switch (exp.kind) {
    case "VarTerm":
    case "QualifiedVarTerm":
    case "SymbolTerm":
    case "KeywordTerm":
    case "StringTerm":
    case "IntTerm":
    case "FloatTerm": {
      return [[], exp]
    }

    case "ApplyTerm": {
      const [targetEntries, newTarget] = unnestOperandAtom(state, exp.target)
      const [argsEntriesArray, newArgs] = arrayUnzip(
        exp.args.map((arg) => unnestOperandAtom(state, arg)),
      )
      const argsEntries = argsEntriesArray.flatMap((entries) => entries)
      const freshName = generateFreshName(state)
      const entry: Entry = [
        freshName,
        M.ApplyTerm(newTarget, newArgs, exp.location),
      ]
      return [
        [...targetEntries, ...argsEntries, entry],
        M.VarTerm(freshName, exp.location),
      ]
    }

    case "Let1Term": {
      const rhsEntry: Entry = [exp.name, unnestOperandExp(state, exp.rhs)]
      const [bodyEntries, newBody] = unnestOperandAtom(state, exp.body)
      return [[rhsEntry, ...bodyEntries], newBody]
    }

    case "Begin1Term": {
      const headEntry: Entry = [null, unnestOperandExp(state, exp.head)]
      const [bodyEntries, newBody] = unnestOperandAtom(state, exp.body)
      return [[headEntry, ...bodyEntries], newBody]
    }

    default: {
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, unnestOperandExp(state, exp)]
      return [[entry], M.VarTerm(freshName, exp.location)]
    }
  }
}
