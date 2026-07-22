import { arrayUnzip } from "@xieyuheng/std.js/array"
import * as M from "../meta/index.ts"
import * as Pkg from "../package/index.ts"

export function UnnestOperandPass(pkg: Pkg.Package): void {
  for (const mod of pkg.mods.values()) {
    for (const definition of mod.definitions.values()) {
      unnestOperandDefinition(definition)
    }
  }

  if (pkg.config.compiler.dump) Pkg.packageDumpMods(pkg, "160-unnest-operand")
}

type State = {
  usedNames: Set<string>
}

function createState(usedNames: Set<string>): State {
  return {
    usedNames,
  }
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
    case "TypeDefinition": {
      const usedNames = new Set(definition.parameters)
      const state = createState(usedNames)
      definition.body = unnestOperandTerm(state, definition.body)
      return null
    }

    case "VariableDefinition":
    case "TestDefinition": {
      const usedNames = new Set<string>()
      const state = createState(usedNames)
      definition.body = unnestOperandTerm(state, definition.body)
      return null
    }
  }
}

function generateName(state: State, name: string): string {
  state.usedNames.add(name)
  const freshName = M.generateRelativeFreshName(state.usedNames, name)
  state.usedNames.add(freshName)
  return freshName
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
      const unnestedName = generateName(state, "unnested")
      const entry: Entry = [
        unnestedName,
        M.ApplyTerm(newTarget, newArgs, term.location),
      ]
      return [
        [...targetEntries, ...argsEntries, entry],
        M.VarTerm(unnestedName, term.location),
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
      const unnestedName = generateName(state, "unnested")
      const entry: Entry = [unnestedName, unnestOperandTerm(state, term)]
      return [[entry], M.VarTerm(unnestedName, term.location)]
    }
  }
}
