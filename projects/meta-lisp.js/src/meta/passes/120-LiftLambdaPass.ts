import assert from "node:assert"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

export function LiftLambdaPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const mod of project.mods.values()) {
    mod.definitions = new Map(
      mod.definitions
        .values()
        .flatMap((definition) => liftLambdaDefinition(mod, definition))
        .map((definition) => [definition.name, definition]),
    )
  }

  if (options.dump) projectDumpMods(project, "120-lift-lambda")
}

type State = {
  mod: M.Mod
  lifted: Array<M.Definition>
  definition: M.Definition
}

function liftLambdaDefinition(
  mod: M.Mod,
  definition: M.Definition,
): Array<M.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition":
    case "AlgebraicTypeDefinition":
    case "OpaqueTypeDefinition": {
      return [definition]
    }

    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition":
    case "TypeDefinition": {
      const lifted: Array<M.Definition> = []
      const state = { mod, lifted, definition }
      definition.body = liftLambdaExp(state, definition.body)
      return [
        definition,
        ...lifted.flatMap((definition) =>
          liftLambdaDefinition(mod, definition),
        ),
      ]
    }
  }
}

function liftLambdaExp(state: State, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "LambdaExp": {
      const freeNames = Array.from(M.expFreeNames(new Set(), exp))
      const liftedCount = state.lifted.length + 1
      const newFunctionName = `${state.definition.name}©λ${liftedCount}`
      const newParameters = [...freeNames, ...exp.parameters]
      const arity = newParameters.length
      assert(exp.location)
      state.lifted.push(
        M.FunctionDefinition(
          state.mod,
          newFunctionName,
          newParameters,
          exp.body,
          exp.location,
        ),
      )

      const qualifiedFunctionName = `${state.mod.name}/${newFunctionName}`

      if (freeNames.length == 0) {
        return M.VarExp(qualifiedFunctionName, exp.location)
      } else {
        return M.ApplyExp(
          M.VarExp(qualifiedFunctionName, exp.location),
          freeNames.map((name) => M.VarExp(name, exp.location)),
          exp.location,
        )
      }
    }

    default: {
      return M.expTraverse((e) => liftLambdaExp(state, e), exp)
    }
  }
}
