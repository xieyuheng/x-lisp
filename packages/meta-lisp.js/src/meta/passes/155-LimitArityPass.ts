import * as C from "../../core/index.ts"
import * as M from "../../meta/index.ts"

export function LimitArityPass(pkg: M.Package, maxArity: number): void {
  for (const coreMod of pkg.coreMods.values()) {
    coreMod.definitions = new Map(
      coreMod.definitions
        .values()
        .map((definition) => [
          definition.name,
          limitArityDefinition(coreMod, definition, maxArity),
        ]),
    )
  }

  if (pkg.config.compiler.dump) M.packageDumpCoreMods(pkg, "155-limit-arity")
}

function limitArityDefinition(
  coreMod: C.Mod,
  definition: C.Definition,
  maxArity: number,
): C.Definition {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration": {
      return definition
    }

    case "FunctionDefinition": {
      const params = definition.parameters
      if (params.length <= maxArity) {
        definition.body = limitArityTerm(definition.body, maxArity)
        return definition
      }

      // if the args are: (x1 x2 x3 x4 x5 x6 x7 x8 x9) and maxArity == 6.
      // the limited args should be (x1 x2 x3 x4 x5 ©rest)
      // and ©rest == (x6 x7 x8 x9)
      const firstParams = params.slice(0, maxArity - 1)
      const extraParams = params.slice(maxArity - 1)
      const restName = "©rest"

      const body = extraParams.reduceRight(
        (body: C.Term, param: string, i: number): C.Term =>
          C.Let1Term(
            param,
            C.ApplyTerm(
              C.QualifiedVarTerm(
                "meta-builtin",
                "builtin",
                "list-get",
                definition.location,
              ),
              [
                C.IntTerm(BigInt(i), definition.location),
                C.VarTerm(restName, definition.location),
              ],
              definition.location,
            ),
            body,
            definition.location,
          ),
        limitArityTerm(definition.body, maxArity),
      )

      return C.FunctionDefinition(
        coreMod,
        definition.name,
        [...firstParams, restName],
        body,
        definition.location,
      )
    }

    case "VariableDefinition":
    case "TestDefinition": {
      definition.body = limitArityTerm(definition.body, maxArity)
      return definition
    }
  }
}

function limitArityTerm(term: C.Term, maxArity: number): C.Term {
  switch (term.kind) {
    case "ApplyTerm": {
      const target = limitArityTerm(term.target, maxArity)
      const args = term.args.map((a) => limitArityTerm(a, maxArity))
      if (args.length <= maxArity) {
        return C.ApplyTerm(target, args, term.location)
      }

      const firstArgs = args.slice(0, maxArity - 1)
      const restArgs = args.slice(maxArity - 1)

      const restList = restArgs.reduceRight(
        (restList: C.Term, arg: C.Term): C.Term =>
          C.ApplyTerm(
            C.QualifiedVarTerm(
              "meta-builtin",
              "builtin",
              "cons",
              term.location,
            ),
            [arg, restList],
            term.location,
          ),
        C.ApplyTerm(
          C.QualifiedVarTerm(
            "meta-builtin",
            "builtin",
            "make-list",
            term.location,
          ),
          [],
          term.location,
        ),
      )

      return C.ApplyTerm(target, [...firstArgs, restList], term.location)
    }

    default: {
      return C.termTraverse((e) => limitArityTerm(e, maxArity), term)
    }
  }
}
