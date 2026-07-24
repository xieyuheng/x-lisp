import * as C from "../core/index.ts"
import * as Pkg from "../package/index.ts"

export function LiftLambdaPass(pkg: Pkg.Package): void {
  for (const coreMod of pkg.coreMods.values()) {
    coreMod.definitions = new Map(
      coreMod.definitions
        .values()
        .flatMap((definition) => liftLambdaDefinition(coreMod, definition))
        .map((definition) => [definition.name, definition]),
    )
  }

  if (pkg.config.compiler.dump) Pkg.packageDumpCoreMods(pkg, "150-lift-lambda")
}

type State = {
  coreMod: C.Mod
  lifted: Array<C.Definition>
  definition: C.Definition
}

function liftLambdaDefinition(
  coreMod: C.Mod,
  definition: C.Definition,
): Array<C.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration": {
      return [definition]
    }

    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition": {
      const lifted: Array<C.Definition> = []
      const state = { coreMod, lifted, definition }
      definition.body = liftLambdaTerm(state, definition.body)
      return [
        definition,
        ...lifted.flatMap((definition) =>
          liftLambdaDefinition(coreMod, definition),
        ),
      ]
    }
  }
}

function liftLambdaTerm(state: State, term: C.Term): C.Term {
  switch (term.kind) {
    case "LambdaTerm": {
      const freeNames = Array.from(C.termFreeNames(new Set(), term))
      const liftedCount = state.lifted.length + 1
      const newFunctionName = `${state.definition.name}©λ${liftedCount}`
      const newParameters = [...freeNames, ...term.parameters]
      state.lifted.push(
        C.FunctionDefinition(
          state.coreMod,
          newFunctionName,
          newParameters,
          term.body,
          term.location,
        ),
      )

      const liftedRef = C.QualifiedVarTerm(
        state.coreMod.pkg.id,
        state.coreMod.name,
        newFunctionName,
        term.location,
      )

      if (freeNames.length === 0) {
        return liftedRef
      } else {
        return C.ApplyTerm(
          liftedRef,
          freeNames.map((name) => C.VarTerm(name, term.location)),
          term.location,
        )
      }
    }

    default: {
      return C.termTraverse((e) => liftLambdaTerm(state, e), term)
    }
  }
}
