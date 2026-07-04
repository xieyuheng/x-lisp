import * as M from "../index.ts"

export function ShrinkPass(pkg: M.Package): void {
  for (const mod of pkg.mods.values()) {
    for (const definition of mod.definitions.values()) {
      shrinkDefinition(definition)
    }
  }

  if (pkg.config.compiler.dump) M.packageDumpMods(pkg, "130-shrink")
}

function shrinkDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition":
    case "AlgebraicTypeDefinition":
    case "OpaqueTypeDefinition": {
      return null
    }

    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition":
    case "TypeDefinition": {
      definition.body = shrinkTerm(definition.body)
      return null
    }
  }
}

function shrinkTerm(term: M.Term): M.Term {
  switch (term.kind) {
    case "TheTerm": {
      return shrinkTerm(term.instance)
    }

    default: {
      return M.termTraverse(shrinkTerm, term)
    }
  }
}
