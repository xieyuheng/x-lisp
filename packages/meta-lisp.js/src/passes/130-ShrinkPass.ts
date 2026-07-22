import * as M from "../meta/index.ts"
import * as Pkg from "../package/index.ts"

export function ShrinkPass(pkg: Pkg.Package): void {
  for (const mod of pkg.mods.values()) {
    for (const definition of mod.definitions.values()) {
      shrinkDefinition(definition)
    }
  }

  if (pkg.config.compiler.dump) Pkg.packageDumpMods(pkg, "130-shrink")
}

function shrinkDefinition(definition: M.Definition): null {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
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
