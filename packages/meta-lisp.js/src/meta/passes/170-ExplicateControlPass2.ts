import * as B from "../../basic2/index.ts"
import * as M from "../index.ts"

export function ExplicateControlPass2(pkg: M.Package): B.Mod {
  const basicMod = B.createMod()

  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const mod of orderedPkg.mods.values()) {
      for (const definition of mod.definitions.values()) {
        for (const basicDefinition of explicateControlDefinition(
          basicMod,
          definition,
        )) {
          basicMod.definitions.set(basicDefinition.name, basicDefinition)
        }
      }
    }
  }

  return basicMod
}

function definitionQualifiedName(definition: M.Definition): string {
  return `${definition.mod.pkg.id}/${definition.mod.name}/${definition.name}`
}

function explicateControlDefinition(
  basicMod: B.Mod,
  definition: M.Definition,
): Array<B.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      return [B.ExternFunctionDefinition(definitionQualifiedName(definition))]
    }

    case "PrimitiveVariableDeclaration": {
      return [B.ExternVariableDefinition(definitionQualifiedName(definition))]
    }

    // - do not generate code for type.
    case "AlgebraicTypeDefinition":
    case "OpaqueTypeDefinition":
    case "TypeDefinition": {
      return []
    }

    case "FunctionDefinition": {
      return []
    }

    case "TestDefinition": {
      return []
    }

    case "VariableDefinition": {
      return []
    }
  }
}
