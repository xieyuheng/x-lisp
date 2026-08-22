import { arrayZip } from "@xieyuheng/std.js/array"
import * as C from "../../core/index.ts"
import * as M from "../../meta/index.ts"

// UniquifyPass
//
// This pass runs after CheckPass, on the core layer.
// CheckPass has already translated M.Term into C.Term, so we must uniquify
// C.Term here — later core passes (ConvertClosurePass, UnnestOperandPass,
// ExplicateControlPass) rely on local variable names being unique.

export function UniquifyPass(pkg: M.Package): void {
  for (const coreMod of pkg.coreMods.values()) {
    for (const definition of coreMod.definitions.values()) {
      uniquifyDefinition(definition)
    }
  }

  if (pkg.config.compiler.dump) M.packageDumpCoreMods(pkg, "130-uniquify")
}

function uniquifyDefinition(definition: C.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration": {
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
  term: C.Term,
): C.Term {
  switch (term.kind) {
    case "VarTerm": {
      const foundName = nameTable[term.name]
      return foundName ? C.VarTerm(foundName, term.location) : term
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
      return C.LambdaTerm(
        parameters,
        uniquifyTerm(usedNames, newNameTable, term.body),
        term.location,
      )
    }

    case "Let1Term": {
      const newName = M.generateRelativeFreshName(usedNames, term.name)
      usedNames.add(newName)
      const newNameTable = { ...nameTable, [term.name]: newName }
      return C.Let1Term(
        newName,
        uniquifyTerm(usedNames, nameTable, term.rhs),
        uniquifyTerm(usedNames, newNameTable, term.body),
        term.location,
      )
    }

    default: {
      return C.termTraverse((e) => uniquifyTerm(usedNames, nameTable, e), term)
    }
  }
}
