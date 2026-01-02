import { arrayZip } from "@xieyuheng/helpers.js/array"
import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"

export function UniquifyPass(mod: L.Mod): void {
  for (const definition of L.modOwnDefinitions(mod)) {
    onDefinition(definition)
  }
}

function onDefinition(definition: L.Definition): null {
  switch (definition.kind) {
    case "FunctionDefinition":
    case "ConstantDefinition": {
      definition.body = onExp({}, {}, definition.body)
      return null
    }
  }
}

function onExp(
  nameCounts: Record<string, number>,
  nameTable: Record<string, string>,
  exp: L.Exp,
): L.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float": {
      return exp
    }

    case "Var": {
      const foundName = nameTable[exp.name]
      return foundName ? L.Var(foundName, exp.meta) : exp
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
      return L.Lambda(
        parameters,
        onExp(newNameCounts, newNameTable, exp.body),
        exp.meta,
      )
    }

    case "ApplyNullary": {
      return L.ApplyNullary(onExp(nameCounts, nameTable, exp.target), exp.meta)
    }

    case "Apply": {
      return L.Apply(
        onExp(nameCounts, nameTable, exp.target),
        onExp(nameCounts, nameTable, exp.arg),
        exp.meta,
      )
    }

    case "Let1": {
      const newNameCounts = countName(nameCounts, exp.name)
      const newName = generateNameInCounts(newNameCounts, exp.name)
      const newNameTable = { ...nameTable, [exp.name]: newName }
      return L.Let1(
        newName,
        onExp(newNameCounts, nameTable, exp.rhs),
        onExp(newNameCounts, newNameTable, exp.body),
        exp.meta,
      )
    }

    case "If": {
      return L.If(
        onExp(nameCounts, nameTable, exp.condition),
        onExp(nameCounts, nameTable, exp.consequent),
        onExp(nameCounts, nameTable, exp.alternative),
        exp.meta,
      )
    }

    default: {
      let message = `[UniquifyPass] unhandled exp`
      message += `\n  exp: ${L.formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
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
