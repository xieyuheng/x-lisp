import * as C from "../core/index.ts"
import * as Pkg from "../package/index.ts"

export function LimitArityPass(pkg: Pkg.Package, maxArity: number): void {
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

  if (pkg.config.compiler.dump) Pkg.packageDumpCoreMods(pkg, "155-limit-arity")
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

      const firstParams = params.slice(0, maxArity)
      const extraParams = params.slice(maxArity)
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

      const firstArgs = args.slice(0, maxArity)
      const restArgs = args.slice(maxArity)

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
