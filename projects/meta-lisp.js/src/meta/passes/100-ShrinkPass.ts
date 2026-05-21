import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

export function ShrinkPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const mod of project.mods.values()) {
    for (const definition of mod.definitions.values()) {
      shrinkDefinition(definition)
    }
  }

  if (options.dump) projectDumpMods(project, "100-shrink")
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

function shrinkExp(exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "TheExp": {
      return shrinkExp(exp.exp)
    }

    default: {
      return M.expTraverse(shrinkExp, exp)
    }
  }
}
