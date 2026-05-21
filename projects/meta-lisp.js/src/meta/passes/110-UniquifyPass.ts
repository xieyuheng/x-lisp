import { arrayZip } from "@xieyuheng/helpers.js/array"
import * as M from "../index.ts"

export function UniquifyPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const mod of project.mods.values()) {
    for (const definition of mod.definitions.values()) {
      uniquifyDefinition(definition)
    }
  }

  if (options.dump) M.projectDumpMods(project, "110-uniquify")
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
      definition.body = uniquifyExp({}, {}, definition.body)
      return null
    }
  }
}

function uniquifyExp(
  nameCounts: Record<string, number>,
  nameTable: Record<string, string>,
  exp: M.Term,
): M.Term {
  switch (exp.kind) {
    case "VarTerm": {
      const foundName = nameTable[exp.name]
      return foundName ? M.VarTerm(foundName, exp.location) : exp
    }

    case "LambdaTerm": {
      countNames(nameCounts, exp.parameters)
      const parameters = exp.parameters.map((name) =>
        generateNameInCounts(nameCounts, name),
      )
      const newNameTable = {
        ...nameTable,
        ...Object.fromEntries(arrayZip(exp.parameters, parameters)),
      }
      return M.LambdaTerm(
        parameters,
        uniquifyExp(nameCounts, newNameTable, exp.body),
        exp.location,
      )
    }

    case "Let1Term": {
      countName(nameCounts, exp.name)
      const newName = generateNameInCounts(nameCounts, exp.name)
      const newNameTable = { ...nameTable, [exp.name]: newName }
      return M.Let1Term(
        newName,
        uniquifyExp(nameCounts, nameTable, exp.rhs),
        uniquifyExp(nameCounts, newNameTable, exp.body),
        exp.location,
      )
    }

    default: {
      return M.termTraverse((e) => uniquifyExp(nameCounts, nameTable, e), exp)
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
