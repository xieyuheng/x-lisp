import { arrayZip } from "@xieyuheng/std.js/array"
import * as M from "../meta/index.ts"

export function UniquifyPass(pkg: M.Package): void {
  for (const mod of pkg.mods.values()) {
    for (const definition of mod.definitions.values()) {
      uniquifyDefinition(definition)
    }
  }

  if (pkg.config.compiler.dump) M.packageDumpMods(pkg, "115-uniquify")
}

function uniquifyDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "AlgebraicTypeDefinition":
    case "OpaqueTypeDefinition": {
      return null
    }

    case "FunctionDefinition": {
      definition.body = uniquifyTerm(
        new Set(definition.parameters),
        {},
        definition.body,
      )
      return null
    }

    case "TypeDefinition": {
      definition.body = uniquifyTerm(
        new Set(definition.parameters),
        {},
        definition.body,
      )
      return null
    }

    case "VariableDefinition":
    case "TestDefinition": {
      definition.body = uniquifyTerm(new Set(), {}, definition.body)
      return null
    }
  }
}

function uniquifyTerm(
  usedNames: Set<string>,
  nameTable: Record<string, string>,
  term: M.Term,
): M.Term {
  switch (term.kind) {
    case "VarTerm": {
      const foundName = nameTable[term.name]
      return foundName ? M.VarTerm(foundName, term.location) : term
    }

    case "LambdaTerm": {
      const parameters = term.parameters.map((name) => {
        const freshName = M.generateRelativeFreshName(usedNames, name)
        usedNames.add(freshName)
        return freshName
      })
      const newNameTable = {
        ...nameTable,
        ...Object.fromEntries(arrayZip(term.parameters, parameters)),
      }
      return M.LambdaTerm(
        parameters,
        uniquifyTerm(usedNames, newNameTable, term.body),
        term.location,
      )
    }

    case "Let1Term": {
      const newName = M.generateRelativeFreshName(usedNames, term.name)
      usedNames.add(newName)
      const newNameTable = { ...nameTable, [term.name]: newName }
      return M.Let1Term(
        newName,
        uniquifyTerm(usedNames, nameTable, term.rhs),
        uniquifyTerm(usedNames, newNameTable, term.body),
        term.location,
      )
    }

    default: {
      return M.termTraverse((e) => uniquifyTerm(usedNames, nameTable, e), term)
    }
  }
}
