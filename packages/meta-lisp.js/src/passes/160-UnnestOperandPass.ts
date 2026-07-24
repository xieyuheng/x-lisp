import { arrayUnzip } from "@xieyuheng/std.js/array"
import * as C from "../core/index.ts"
import * as M from "../meta/index.ts"
import * as Pkg from "../package/index.ts"

export function UnnestOperandPass(pkg: Pkg.Package): void {
  for (const coreMod of pkg.coreMods.values()) {
    for (const definition of coreMod.definitions.values()) {
      unnestOperandDefinition(definition)
    }
  }

  if (pkg.config.compiler.dump)
    Pkg.packageDumpCoreMods(pkg, "160-unnest-operand")
}

type State = {
  usedNames: Set<string>
}

function createState(usedNames: Set<string>): State {
  return { usedNames }
}

function unnestOperandDefinition(definition: C.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration": {
      return null
    }

    case "FunctionDefinition": {
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

function unnestOperandTerm(state: State, term: C.Term): C.Term {
  switch (term.kind) {
    case "ApplyTerm": {
      const [targetEntries, newTarget] = unnestOperandAtom(state, term.target)
      const [argsEntriesArray, newArgs] = arrayUnzip(
        term.args.map((arg) => unnestOperandAtom(state, arg)),
      )
      const argsEntries = argsEntriesArray.flatMap((entries) => entries)
      return prependLets(
        [...targetEntries, ...argsEntries],
        C.ApplyTerm(newTarget, newArgs, term.location),
      )
    }

    default: {
      return C.termTraverse((e) => unnestOperandTerm(state, e), term)
    }
  }
}

function prependLets(entries: Array<Entry>, term: C.Term): C.Term {
  if (entries.length === 0) {
    return term
  }

  const [[name, rhs], ...restEntries] = entries
  const body = prependLets(restEntries, term)
  if (name === null) {
    return C.Begin1Term(rhs, body, term.location)
  } else {
    return C.Let1Term(name, rhs, body, term.location)
  }
}

type Entry = [string | null, C.Term]

function unnestOperandAtom(state: State, term: C.Term): [Array<Entry>, C.Term] {
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
      const rhs = C.ApplyTerm(newTarget, newArgs, term.location)
      const entry: Entry = [unnestedName, rhs]
      return [
        [...targetEntries, ...argsEntries, entry],
        C.VarTerm(unnestedName, term.location),
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
      const rhs = unnestOperandTerm(state, term)
      const entry: Entry = [unnestedName, rhs]
      return [[entry], C.VarTerm(unnestedName, term.location)]
    }
  }
}
