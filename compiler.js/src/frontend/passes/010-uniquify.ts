import type { Definition } from "../definition/index.ts"
import * as Definitions from "../definition/index.ts"
import type { Exp } from "../exp/index.ts"
import * as Exps from "../exp/index.ts"
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
      throw new Error()
    }

    case "Apply": {
      return Exps.Apply(
        uniquifyExp(nameCounts, nameTable, exp.target),
        exp.args.map((arg) => uniquifyExp(nameCounts, nameTable, arg)),
        exp.meta,
      )
    }

    case "BeginSugar": {
      return Exps.BeginSugar(
        exp.sequence.map((e) => uniquifyExp(nameCounts, nameTable, e)),
        exp.meta,
      )
    }

    case "AssignSugar": {
      throw new Error()
    }

    case "If": {
      return Exps.If(
        uniquifyExp(nameCounts, nameTable, exp.condition),
        uniquifyExp(nameCounts, nameTable, exp.consequent),
        uniquifyExp(nameCounts, nameTable, exp.alternative),
        exp.meta,
      )
    }
  }
}
