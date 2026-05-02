import { recordMapValue } from "@xieyuheng/helpers.js/record"
import { setUnion } from "@xieyuheng/helpers.js/set"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

export function QualifyPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  M.projectForEachMod(project, (mod) => {
    M.modForEachOwnDefinition(mod, qualifyDefinition)
  })

  if (options.dump) projectDumpMods(project, "020-qualify")
}

function qualifyDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      return null
    }

    case "FunctionDefinition": {
      definition.body = qualifyFreeVar(
        definition.mod,
        new Set(definition.parameters),
        definition.body,
      )
      return null
    }

    case "VariableDefinition": {
      definition.body = qualifyFreeVar(
        definition.mod,
        new Set(),
        definition.body,
      )
      return null
    }

    case "TestDefinition": {
      definition.body = qualifyFreeVar(
        definition.mod,
        new Set(),
        definition.body,
      )
      return null
    }

    case "TypeDefinition": {
      definition.body = qualifyFreeVar(
        definition.mod,
        new Set(definition.parameters),
        definition.body,
      )
      return null
    }

    case "DataDefinition": {
      const boundNames = new Set(definition.dataTypeConstructor.parameters)
      definition.dataConstructors = definition.dataConstructors.map(
        ({ name, fields }) => ({
          definition,
          name,
          fields: fields.map(({ name, type }) => ({
            name,
            type: qualifyFreeVar(definition.mod, boundNames, type),
          })),
        }),
      )

      return null
    }

    case "InterfaceDefinition": {
      const boundNames = new Set(definition.interfaceConstructor.parameters)
      definition.attributeTypes = recordMapValue(
        definition.attributeTypes,
        (attributeType) =>
          qualifyFreeVar(definition.mod, boundNames, attributeType),
      )

      return null
    }
  }
}

// - can not handle `Match`, must be called after `desugar`.

export function qualifyFreeVar(
  mod: M.Mod,
  boundNames: Set<string>,
  exp: M.Exp,
): M.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float": {
      return exp
    }

    case "Quote": {
      return exp
    }

    case "QualifiedVar": {
      return exp
    }

    case "Var": {
      if (boundNames.has(exp.name)) {
        return exp
      }

      const builtinMod = M.loadBuiltinMod(mod.project)

      const definition = M.modLookupDefinition(builtinMod, exp.name)
      if (definition) {
        return M.QualifiedVar(builtinMod.name, exp.name, exp.location)
      }

      const claimedType = M.modLookupClaimedType(builtinMod, exp.name)
      if (claimedType) {
        return M.QualifiedVar(builtinMod.name, exp.name, exp.location)
      }

      return M.QualifiedVar(mod.name, exp.name, exp.location)
    }

    // no need to avoid free variable in lhs

    case "Lambda": {
      return M.Lambda(
        exp.parameters,
        qualifyFreeVar(
          mod,
          setUnion(boundNames, new Set(exp.parameters)),
          exp.body,
        ),
        exp.location,
      )
    }

    case "Polymorphic": {
      return M.Polymorphic(
        exp.parameters,
        qualifyFreeVar(
          mod,
          setUnion(boundNames, new Set(exp.parameters)),
          exp.body,
        ),
        exp.location,
      )
    }

    case "Let1": {
      return M.Let1(
        exp.name,
        qualifyFreeVar(mod, boundNames, exp.rhs),
        qualifyFreeVar(
          mod,
          setUnion(boundNames, new Set([exp.name])),
          exp.body,
        ),
        exp.location,
      )
    }

    default: {
      return M.expTraverse(
        (child) => qualifyFreeVar(mod, boundNames, child),
        exp,
      )
    }
  }
}
