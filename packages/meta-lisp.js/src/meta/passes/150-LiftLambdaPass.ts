import * as M from "../index.ts"

export function LiftLambdaPass(pkg: M.Package): void {
  for (const mod of pkg.mods.values()) {
    mod.definitions = new Map(
      mod.definitions
        .values()
        .flatMap((definition) => liftLambdaDefinition(mod, definition))
        .map((definition) => [definition.name, definition]),
    )
  }

  if (pkg.config.compiler.dump) M.packageDumpMods(pkg, "150-lift-lambda")
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
      definition.body = liftLambdaTerm(state, definition.body)
      return [
        definition,
        ...lifted.flatMap((definition) =>
          liftLambdaDefinition(mod, definition),
        ),
      ]
    }
  }
}

function liftLambdaTerm(state: State, term: M.Term): M.Term {
  switch (term.kind) {
    case "LambdaTerm": {
      const freeNames = Array.from(M.termFreeNames(new Set(), term))
      const liftedCount = state.lifted.length + 1
      const newFunctionName = `${state.definition.name}©λ${liftedCount}`
      const newParameters = [...freeNames, ...term.parameters]
      const arity = newParameters.length
      state.lifted.push(
        M.FunctionDefinition(
          state.mod,
          newFunctionName,
          newParameters,
          term.body,
          term.location,
        ),
      )

      const liftedRef = M.QualifiedVarTerm(
        state.mod.pkg.id,
        state.mod.name,
        newFunctionName,
        term.location,
      )

      if (freeNames.length == 0) {
        return liftedRef
      } else {
        return M.ApplyTerm(
          liftedRef,
          freeNames.map((name) => M.VarTerm(name, term.location)),
          term.location,
        )
      }
    }

    default: {
      return M.termTraverse((e) => liftLambdaTerm(state, e), term)
    }
  }
}
