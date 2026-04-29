import { arrayZip } from "@xieyuheng/helpers.js/array"
import * as M from "../index.ts"

export function UniquifyPass(mod: M.Mod): void {
  for (const definition of M.modOwnDefinitions(mod)) {
    onDefinition(definition)
  }
}

function onDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
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
      countNames(nameCounts, exp.parameters)
      const parameters = exp.parameters.map((name) =>
        generateNameInCounts(nameCounts, name),
      )
      const newNameTable = {
        ...nameTable,
        ...Object.fromEntries(arrayZip(exp.parameters, parameters)),
      }
      return M.Lambda(
        parameters,
        onExp(nameCounts, newNameTable, exp.body),
        exp.location,
      )
    }

    case "Let1": {
      countName(nameCounts, exp.name)
      const newName = generateNameInCounts(nameCounts, exp.name)
      const newNameTable = { ...nameTable, [exp.name]: newName }
      return M.Let1(
        newName,
        onExp(nameCounts, nameTable, exp.rhs),
        onExp(nameCounts, newNameTable, exp.body),
        exp.location,
      )
    }

    default: {
      return M.expTraverse((e) => onExp(nameCounts, nameTable, e), exp)
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
