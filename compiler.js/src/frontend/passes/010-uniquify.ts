import * as X from "@xieyuheng/x-sexp.js"
import { stringToSubscript } from "../../helpers/string/stringToSubscript.ts"
import type { Definition } from "../definition/index.ts"
import * as Definitions from "../definition/index.ts"
import type { Exp } from "../exp/index.ts"
import * as Exps from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { modMapDefinition, type Mod } from "../mod/index.ts"

export function uniquify(mod: Mod): Mod {
  return modMapDefinition(mod, uniquifyDefinition)
}

function uniquifyDefinition(definition: Definition): Definition {
  switch (definition.kind) {
    case "FunctionDefinition": {
      return Definitions.FunctionDefinition(
        definition.name,
        definition.parameters,
        uniquifyExp({}, {}, definition.body),
        definition.meta,
      )
    }
  }
}

function uniquifyExp(
  nameCounts: Record<string, number>,
  nameTable: Record<string, string>,
  exp: Exp,
): Exp {
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
      return foundName ? Exps.Var(foundName, exp.meta) : exp
    }

    case "Lambda": {
      let newNameCounts = countNames(nameCounts, exp.parameters)
      const parameters = exp.parameters.map((name) =>
        generateNameInCounts(newNameCounts, name),
      )

      const newNameTable = { ...nameTable }
      for (const [index, name] of exp.parameters.entries()) {
        newNameTable[name] = parameters[index]
      }

      return Exps.Lambda(
        parameters,
        uniquifyExp(newNameCounts, newNameTable, exp.body),
        exp.meta,
      )
    }

    case "Apply": {
      return Exps.Apply(
        uniquifyExp(nameCounts, nameTable, exp.target),
        exp.args.map((arg) => uniquifyExp(nameCounts, nameTable, arg)),
        exp.meta,
      )
    }

    case "Begin": {
      return Exps.Begin(
        uniquifyExp(nameCounts, nameTable, exp.head),
        uniquifyExp(nameCounts, nameTable, exp.body),
        exp.meta,
      )
    }

    case "Let1": {
      const newNameCounts = countName(nameCounts, exp.name)
      const newName = generateNameInCounts(newNameCounts, exp.name)
      const newNameTable = { ...nameTable, [exp.name]: newName }
      return Exps.Let1(
        newName,
        uniquifyExp(newNameCounts, nameTable, exp.rhs),
        uniquifyExp(newNameCounts, newNameTable, exp.body),
        exp.meta,
      )
    }

    case "If": {
      return Exps.If(
        uniquifyExp(nameCounts, nameTable, exp.condition),
        uniquifyExp(nameCounts, nameTable, exp.consequent),
        uniquifyExp(nameCounts, nameTable, exp.alternative),
        exp.meta,
      )
    }

    default: {
      let message = `[uniquify] unhandled exp`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new X.ErrorWithMeta(message, exp.meta)
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
    return { ...nameCounts, [name]: 0 }
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
