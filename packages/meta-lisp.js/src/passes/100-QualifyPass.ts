import { setUnion } from "@xieyuheng/std.js/set"
import * as M from "../meta/index.ts"
import * as Pkg from "../package/index.ts"

export function QualifyPass(pkg: Pkg.Package): void {
  for (const mod of pkg.mods.values()) {
    for (const definition of mod.definitions.values()) {
      qualifyDefinition(definition)
    }
  }

  if (pkg.config.compiler.dump) Pkg.packageDumpMods(pkg, "100-qualify")
}

function qualifyDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration": {
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
        (dataConstructor) =>
          qualifyDataConstructor(boundNames, dataConstructor),
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

      definition.interfaceEntries = definition.interfaceEntries.map((entry) =>
        qualifyInterfaceEntry(definition.mod, boundNames, entry),
      )

      return null
    }
  }
}

function qualifyDataConstructor(
  boundNames: Set<string>,
  dataConstructor: M.DataConstructor,
): M.DataConstructor {
  return {
    mod: dataConstructor.mod,
    typeName: dataConstructor.typeName,
    name: dataConstructor.name,
    fields: dataConstructor.fields.map((field) =>
      qualifyDataField(dataConstructor.mod, boundNames, field),
    ),
    location: dataConstructor.location,
  }
}

function qualifyDataField(
  mod: M.Mod,
  boundNames: Set<string>,
  field: M.DataField,
): M.DataField {
  return {
    name: field.name,
    type: qualifyFreeVar(mod, boundNames, field.type),
    location: field.location,
  }
}

function qualifyInterfaceEntry(
  mod: M.Mod,
  boundNames: Set<string>,
  entry: M.InterfaceEntry,
): M.InterfaceEntry {
  return {
    name: entry.name,
    type: qualifyFreeVar(mod, boundNames, entry.type),
    location: entry.location,
  }
}

function qualifyFreeVar(
  mod: M.Mod,
  boundNames: Set<string>,
  term: M.Term,
): M.Term {
  switch (term.kind) {
    case "VarTerm": {
      if (boundNames.has(term.name)) {
        return term
      } else {
        return M.QualifiedVarTerm(
          mod.pkg.id,
          mod.name,
          term.name,
          term.location,
        )
      }
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
