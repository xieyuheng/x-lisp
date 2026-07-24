import * as C from "../core/index.ts"
import * as Pkg from "../package/index.ts"

export function ConvertClosurePass(pkg: Pkg.Package): void {
  for (const coreMod of pkg.coreMods.values()) {
    coreMod.definitions = new Map(
      coreMod.definitions
        .values()
        .flatMap((definition) => convertClosureDefinition(coreMod, definition))
        .map((definition) => [definition.name, definition]),
    )
  }

  if (pkg.config.compiler.dump)
    Pkg.packageDumpCoreMods(pkg, "150-convert-closure")
}

type State = {
  coreMod: C.Mod
  lifted: Array<C.Definition>
  definition: C.Definition
}

function convertClosureDefinition(
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
      definition.body = convertClosureTerm(state, definition.body)
      return [
        definition,
        ...lifted.flatMap((definition) =>
          convertClosureDefinition(coreMod, definition),
        ),
      ]
    }
  }
}

function convertClosureTerm(state: State, term: C.Term): C.Term {
  switch (term.kind) {
    case "LambdaTerm": {
      const freeNames = Array.from(C.termFreeNames(new Set(), term))
      const liftedCount = state.lifted.length + 1
      const newFunctionName = `${state.definition.name}©λ${liftedCount}`

      if (freeNames.length === 0) {
        state.lifted.push(
          C.FunctionDefinition(
            state.coreMod,
            newFunctionName,
            term.parameters,
            term.body,
            term.location,
          ),
        )

        return C.QualifiedVarTerm(
          state.coreMod.pkg.id,
          state.coreMod.name,
          newFunctionName,
          term.location,
        )
      }

      const newParameters = ["©closure", ...term.parameters]
      const newBody = wrapBodyWithClosureArgs(
        freeNames,
        term.body,
        term.location,
      )

      state.lifted.push(
        C.FunctionDefinition(
          state.coreMod,
          newFunctionName,
          newParameters,
          newBody,
          term.location,
        ),
      )

      return buildClosureConstruction(
        state.coreMod.pkg.id,
        state.coreMod.name,
        newFunctionName,
        freeNames,
        term.location,
      )
    }

    default: {
      return C.termTraverse((e) => convertClosureTerm(state, e), term)
    }
  }
}

function wrapBodyWithClosureArgs(
  freeNames: Array<string>,
  body: C.Term,
  location: C.Term["location"],
): C.Term {
  let result = body
  for (let i = 0; i < freeNames.length; i++) {
    result = C.Let1Term(
      freeNames[i],
      C.ApplyTerm(
        C.QualifiedVarTerm("meta-builtin", "builtin", "closure-arg", location),
        [C.IntTerm(BigInt(i), location), C.VarTerm("©closure", location)],
        location,
      ),
      result,
      location,
    )
  }
  return result
}

function buildClosureConstruction(
  pkgId: string,
  modName: string,
  funcName: string,
  freeNames: Array<string>,
  location: C.Term["location"],
): C.Term {
  const size = freeNames.length

  let result: C.Term = C.ApplyTerm(
    C.QualifiedVarTerm("meta-builtin", "builtin", "make-closure", location),
    [
      C.QualifiedVarTerm(pkgId, modName, funcName, location),
      C.IntTerm(BigInt(size), location),
    ],
    location,
  )

  for (let i = 0; i < size; i++) {
    result = C.ApplyTerm(
      C.QualifiedVarTerm(
        "meta-builtin",
        "builtin",
        "closure-put-arg!",
        location,
      ),
      [
        C.IntTerm(BigInt(i), location),
        C.VarTerm(freeNames[i], location),
        result,
      ],
      location,
    )
  }

  return result
}
