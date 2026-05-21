import { arrayUnzip } from "@xieyuheng/helpers.js/array"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

export function UnnestOperandPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const mod of project.mods.values()) {
    for (const definition of mod.definitions.values()) {
      unnestOperandDefinition(definition)
    }
  }

  if (options.dump) projectDumpMods(project, "130-unnest-operand")
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

function unnestOperandExp(state: State, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "ApplyExp": {
      const [targetEntries, newTarget] = unnestOperandAtom(state, exp.target)
      const [argsEntriesArray, newArgs] = arrayUnzip(
        exp.args.map((arg) => unnestOperandAtom(state, arg)),
      )
      const argsEntries = argsEntriesArray.flatMap((entries) => entries)
      return prependLets(
        [...targetEntries, ...argsEntries],
        M.ApplyExp(newTarget, newArgs, exp.location),
      )
    }

    default: {
      return M.expTraverse((e) => unnestOperandExp(state, e), exp)
    }
  }
}

function prependLets(entries: Array<Entry>, exp: M.Exp): M.Exp {
  if (entries.length === 0) {
    return exp
  }

  const [[name, rhs], ...restEntries] = entries
  if (name === null) {
    return M.Begin1Exp(rhs, prependLets(restEntries, exp), exp.location)
  } else {
    return M.Let1Exp(name, rhs, prependLets(restEntries, exp), exp.location)
  }
}

type Entry = [string | null, M.Exp]

function unnestOperandAtom(state: State, exp: M.Exp): [Array<Entry>, M.Exp] {
  switch (exp.kind) {
    case "VarExp":
    case "QualifiedVarExp":
    case "SymbolExp":
    case "KeywordExp":
    case "StringExp":
    case "IntExp":
    case "FloatExp": {
      return [[], exp]
    }

    case "ApplyExp": {
      const [targetEntries, newTarget] = unnestOperandAtom(state, exp.target)
      const [argsEntriesArray, newArgs] = arrayUnzip(
        exp.args.map((arg) => unnestOperandAtom(state, arg)),
      )
      const argsEntries = argsEntriesArray.flatMap((entries) => entries)
      const freshName = generateFreshName(state)
      const entry: Entry = [
        freshName,
        M.ApplyExp(newTarget, newArgs, exp.location),
      ]
      return [
        [...targetEntries, ...argsEntries, entry],
        M.VarExp(freshName, exp.location),
      ]
    }

    case "Let1Exp": {
      const rhsEntry: Entry = [exp.name, unnestOperandExp(state, exp.rhs)]
      const [bodyEntries, newBody] = unnestOperandAtom(state, exp.body)
      return [[rhsEntry, ...bodyEntries], newBody]
    }

    case "Begin1Exp": {
      const headEntry: Entry = [null, unnestOperandExp(state, exp.head)]
      const [bodyEntries, newBody] = unnestOperandAtom(state, exp.body)
      return [[headEntry, ...bodyEntries], newBody]
    }

    default: {
      const freshName = generateFreshName(state)
      const entry: Entry = [freshName, unnestOperandExp(state, exp)]
      return [[entry], M.VarExp(freshName, exp.location)]
    }
  }
}
