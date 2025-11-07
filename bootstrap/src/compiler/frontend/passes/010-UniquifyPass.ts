import * as X from "@xieyuheng/x-sexp.js"
import { arrayZip } from "../../../helpers/array/arrayZip.ts"
import { stringToSubscript } from "../../../helpers/string/stringToSubscript.ts"
import * as Definitions from "../definition/index.ts"
import { type Definition } from "../definition/index.ts"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { modMapDefinition, type Mod } from "../mod/index.ts"

export function UniquifyPass(mod: Mod): Mod {
  return modMapDefinition(mod, onDefinition)
}

function onDefinition(definition: Definition): Definition {
  switch (definition.kind) {
    case "FunctionDefinition": {
      return Definitions.FunctionDefinition(
        definition.name,
        definition.parameters,
        onExp({}, {}, definition.body),
        definition.meta,
      )
    }
  }
}

function onExp(
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
      const newNameCounts = countNames(nameCounts, exp.parameters)
      const parameters = exp.parameters.map((name) =>
        generateNameInCounts(newNameCounts, name),
      )
      const newNameTable = {
        ...nameTable,
        ...Object.fromEntries(arrayZip(exp.parameters, parameters)),
      }
      return Exps.Lambda(
        parameters,
        onExp(newNameCounts, newNameTable, exp.body),
        exp.meta,
      )
    }

    case "Apply": {
      return Exps.Apply(
        onExp(nameCounts, nameTable, exp.target),
        exp.args.map((e) => onExp(nameCounts, nameTable, e)),
        exp.meta,
      )
    }

    case "Let1": {
      const newNameCounts = countName(nameCounts, exp.name)
      const newName = generateNameInCounts(newNameCounts, exp.name)
      const newNameTable = { ...nameTable, [exp.name]: newName }
      return Exps.Let1(
        newName,
        onExp(newNameCounts, nameTable, exp.rhs),
        onExp(newNameCounts, newNameTable, exp.body),
        exp.meta,
      )
    }

    case "If": {
      return Exps.If(
        onExp(nameCounts, nameTable, exp.condition),
        onExp(nameCounts, nameTable, exp.consequent),
        onExp(nameCounts, nameTable, exp.alternative),
        exp.meta,
      )
    }

    default: {
      let message = `[UniquifyPass] unhandled exp`
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
