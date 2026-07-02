
import { setUnion } from "@xieyuheng/std.js/set"
import * as M from "../index.ts"

export function QualifyPass(pkg: M.Package): void {
  for (const mod of pkg.mods.values()) {
    for (const definition of mod.definitions.values()) {
      qualifyDefinition(definition)
    }
  }

  if (pkg.config.compiler.dump) M.packageDumpMods(pkg, "100-qualify")
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
  term: M.Term,
): M.Term {
  switch (term.kind) {
    case "VarTerm": {
      if (boundNames.has(term.name)) {
        return term
      }

      return M.QualifiedVarTerm(mod.pkg.id, mod.name, term.name, term.location)
    }

    case "LambdaTerm": {
      return M.LambdaTerm(
        term.parameters,
        qualifyFreeVar(
          mod,
          setUnion(boundNames, new Set(term.parameters)),
          term.body,
        ),
        term.location,
      )
    }

    case "PolymorphicTerm": {
      return M.PolymorphicTerm(
        term.parameters,
        qualifyFreeVar(
          mod,
          setUnion(boundNames, new Set(term.parameters)),
          term.body,
        ),
        term.location,
      )
    }

    case "Let1Term": {
      return M.Let1Term(
        term.name,
        qualifyFreeVar(mod, boundNames, term.rhs),
        qualifyFreeVar(
          mod,
          setUnion(boundNames, new Set([term.name])),
          term.body,
        ),
        term.location,
      )
    }

    default: {
      return M.termTraverse(
        (child) => qualifyFreeVar(mod, boundNames, child),
        term,
      )
    }
  }
}
