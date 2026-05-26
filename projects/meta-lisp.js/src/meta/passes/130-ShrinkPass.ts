import * as M from "../index.ts"

export function ShrinkPass(
  project: M.Project,
  options: Map<string, string>,
): void {
  for (const mod of project.mods.values()) {
    for (const definition of mod.definitions.values()) {
      shrinkDefinition(definition)
    }
  }

  if (options.has("dump")) M.projectDumpMods(project, "130-shrink")
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
      definition.body = shrinkExp(definition.body)
      return null
    }
  }
}

function shrinkExp(exp: M.Term): M.Term {
  switch (exp.kind) {
    case "TheTerm": {
      return shrinkExp(exp.instance)
    }

    default: {
      return M.termTraverse(shrinkExp, exp)
    }
  }
}
