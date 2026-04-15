import * as M from "../index.ts"
import { arrayZip } from "@xieyuheng/helpers.js/array"
import { stringToSubscript } from "@xieyuheng/helpers.js/string"

export function UniquifyPass(mod: M.Mod): void {
  for (const definition of M.modOwnDefinitions(mod)) {
    onDefinition(definition)
  }
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
    case "VariableDefinition":
    case "TestDefinition":
    case "TypeDefinition": {
      definition.body = onExp({}, {}, definition.body)
      return null
    }
  }
}

function onExp(
  nameCounts: Record<string, number>,
  nameTable: Record<string, string>,
  exp: M.Exp,
): M.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "QualifiedVar": {
      return exp
    }

    case "Var": {
      const foundName = nameTable[exp.name]
      return foundName ? M.Var(foundName, exp.location) : exp
    }

    case "Lambda": {
      const newNameCounts = countNames(nameCounts, exp.parameters)
      const parameters = exp.parameters.map((name) =>
        generateNameInCounts(newNameCounts, name),
      )
      const newNameTable = {
        ...nameTable,
        ...Object.fromEntries(arrayZip(exp.parameters, parameters)),
      }
      return M.Lambda(
        parameters,
        onExp(newNameCounts, newNameTable, exp.body),
        exp.location,
      )
    }

    case "Let1": {
      const newNameCounts = countName(nameCounts, exp.name)
      const newName = generateNameInCounts(newNameCounts, exp.name)
      const newNameTable = { ...nameTable, [exp.name]: newName }
      return M.Let1(
        newName,
        onExp(newNameCounts, nameTable, exp.rhs),
        onExp(newNameCounts, newNameTable, exp.body),
        exp.location,
      )
    }

    default: {
      return M.expTraverse((e) => onExp(nameCounts, nameTable, e), exp)
    }
  }
}

function countName(
  nameCounts: Record<string, number>,
  name: string,
): Record<string, number> {
  const count = nameCounts[name]
  if (count === undefined) {
    return { ...nameCounts, [name]: 1 }
  } else {
    return { ...nameCounts, [name]: count + 1 }
  }
}

function countNames(
  nameCounts: Record<string, number>,
  names: Array<string>,
): Record<string, number> {
  if (names.length === 0) {
    return nameCounts
  }

  const [name, ...restNames] = names
  return countNames(countName(nameCounts, name), restNames)
}

function generateNameInCounts(
  nameCounts: Record<string, number>,
  name: string,
): string {
  const count = nameCounts[name]
  if (count === undefined) {
    return name
  } else {
    const subscript = stringToSubscript(count.toString())
    return `${name}${subscript}`
  }
}
