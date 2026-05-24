import { setUnion } from "@xieyuheng/helpers.js/set"
import * as M from "../index.ts"

export function QualifyPass(
  project: M.Project,
  options: Map<string, string>,
): void {
  for (const mod of project.mods.values()) {
    for (const definition of mod.definitions.values()) {
      qualifyDefinition(definition)
    }
  }

  if (options.has("dump")) M.projectDumpMods(project, "100-qualify")
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

    case "AlgebraicTypeDefinition": {
      const boundNames = new Set(definition.typeConstructor.parameters)
      definition.dataConstructors = definition.dataConstructors.map(
        ({ name, fields, location }) => ({
          mod: definition.mod,
          typeName: definition.name,
          name,
          fields: fields.map(({ name, type, location }) => ({
            name,
            type: qualifyFreeVar(definition.mod, boundNames, type),
            location,
          })),
          location,
        }),
      )

      return null
    }

    case "OpaqueTypeDefinition": {
      const boundNames = new Set(definition.typeConstructor.parameters)
      definition.representationType = qualifyFreeVar(
        definition.mod,
        boundNames,
        definition.representationType,
      )

      definition.interfaceEntries = definition.interfaceEntries.map(
        ({ name, type, location }) => ({
          name,
          type: qualifyFreeVar(definition.mod, boundNames, type),
          location,
        }),
      )

      return null
    }
  }
}

export function qualifyFreeVar(
  mod: M.Mod,
  boundNames: Set<string>,
  exp: M.Term,
): M.Term {
  switch (exp.kind) {
    case "VarTerm": {
      if (boundNames.has(exp.name)) {
        return exp
      }

      return M.QualifiedVarTerm(mod.name, exp.name, exp.location)
    }

    case "LambdaTerm": {
      return M.LambdaTerm(
        exp.parameters,
        qualifyFreeVar(
          mod,
          setUnion(boundNames, new Set(exp.parameters)),
          exp.body,
        ),
        exp.location,
      )
    }

    case "PolymorphicTerm": {
      return M.PolymorphicTerm(
        exp.parameters,
        qualifyFreeVar(
          mod,
          setUnion(boundNames, new Set(exp.parameters)),
          exp.body,
        ),
        exp.location,
      )
    }

    case "Let1Term": {
      return M.Let1Term(
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
      return M.termTraverse(
        (child) => qualifyFreeVar(mod, boundNames, child),
        exp,
      )
    }
  }
}
