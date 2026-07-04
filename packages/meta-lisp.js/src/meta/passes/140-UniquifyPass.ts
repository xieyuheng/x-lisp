import { arrayZip } from "@xieyuheng/std.js/array"
import * as M from "../index.ts"

export function UniquifyPass(pkg: M.Package): void {
  for (const mod of pkg.mods.values()) {
    for (const definition of mod.definitions.values()) {
      uniquifyDefinition(definition)
    }
  }

  if (pkg.config.compiler.dump) M.packageDumpMods(pkg, "140-uniquify")
}

function uniquifyDefinition(definition: M.Definition): null {
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
      definition.body = uniquifyTerm({}, {}, definition.body)
      return null
    }
  }
}

function uniquifyTerm(
  nameCounts: Record<string, number>,
  nameTable: Record<string, string>,
  term: M.Term,
): M.Term {
  switch (term.kind) {
    case "VarTerm": {
      const foundName = nameTable[term.name]
      return foundName ? M.VarTerm(foundName, term.location) : term
    }

    case "LambdaTerm": {
      countNames(nameCounts, term.parameters)
      const parameters = term.parameters.map((name) =>
        generateNameInCounts(nameCounts, name),
      )
      const newNameTable = {
        ...nameTable,
        ...Object.fromEntries(arrayZip(term.parameters, parameters)),
      }
      return M.LambdaTerm(
        parameters,
        uniquifyTerm(nameCounts, newNameTable, term.body),
        term.location,
      )
    }

    case "Let1Term": {
      countName(nameCounts, term.name)
      const newName = generateNameInCounts(nameCounts, term.name)
      const newNameTable = { ...nameTable, [term.name]: newName }
      return M.Let1Term(
        newName,
        uniquifyTerm(nameCounts, nameTable, term.rhs),
        uniquifyTerm(nameCounts, newNameTable, term.body),
        term.location,
      )
    }

    default: {
      return M.termTraverse((e) => uniquifyTerm(nameCounts, nameTable, e), term)
    }
  }
}

function countName(nameCounts: Record<string, number>, name: string): void {
  const count = nameCounts[name]
  if (count === undefined) {
    nameCounts[name] = 1
  } else {
    nameCounts[name] = count + 1
  }
}

function countNames(
  nameCounts: Record<string, number>,
  names: Array<string>,
): void {
  for (const name of names) {
    countName(nameCounts, name)
  }
}

function generateNameInCounts(
  nameCounts: Record<string, number>,
  name: string,
): string {
  const count = nameCounts[name]
  if (count === undefined) {
    return name
  } else {
    return `${name}.${count}`
  }
}
