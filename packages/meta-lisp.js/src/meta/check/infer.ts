import * as S from "@xieyuheng/sexp.js"
import { arrayZip } from "@xieyuheng/std.js/array"
import { range } from "@xieyuheng/std.js/range"
import * as C from "../../core/index.ts"
import * as Pkg from "../../package/index.ts"
import * as M from "../index.ts"

export type TypeError = { term: M.Term; message: string }

export type Inferred = { core: C.Term; type: M.Type }

export function Inferred(core: C.Term, type: M.Type): Inferred {
  return { core, type }
}

export function infer(
  mod: M.Mod,
  ctx: M.Ctx,
  term: M.Term,
): M.Either<TypeError, Inferred> {
  switch (term.kind) {
    case "SymbolTerm": {
      return M.Right(
        M.Inferred(
          C.SymbolTerm(term.content, term.location),
          M.AtomType("symbol"),
        ),
      )
    }

    case "KeywordTerm": {
      return M.Right(
        M.Inferred(
          C.KeywordTerm(term.content, term.location),
          M.AtomType("keyword"),
        ),
      )
    }

    case "StringTerm": {
      return M.Right(
        M.Inferred(
          C.StringTerm(term.content, term.location),
          M.AtomType("string"),
        ),
      )
    }

    case "IntTerm": {
      return M.Right(
        M.Inferred(C.IntTerm(term.content, term.location), M.AtomType("int")),
      )
    }

    case "FloatTerm": {
      return M.Right(
        M.Inferred(
          C.FloatTerm(term.content, term.location),
          M.AtomType("float"),
        ),
      )
    }

    case "VarTerm": {
      const type = M.ctxLookupType(ctx, term.name)
      if (type) {
        return M.Right(M.Inferred(C.VarTerm(term.name, term.location), type))
      }
      return inferLookup(
        mod,
        ctx,
        term.name,
        C.VarTerm(term.name, term.location),
      )
    }

    case "QualifiedVarTerm": {
      const qualifiedMod = Pkg.packageLookupMod(
        mod.pkg,
        term.pkgName,
        term.modName,
      )
      if (qualifiedMod === undefined) {
        let message = `undefined module prefix`
        message += `\n  from package: ${mod.pkg.rootDirectory}`
        throw new S.ErrorWithSourceLocation(message, term.location)
      }
      return inferLookup(
        qualifiedMod,
        ctx,
        term.name,
        C.QualifiedVarTerm(
          term.pkgName,
          term.modName,
          term.name,
          term.location,
        ),
      )
    }

    case "ApplyTerm": {
      const targetResult = M.infer(mod, ctx, term.target)
      if (M.isLeft(targetResult)) return targetResult
      const targetInferred = targetResult.right

      const argTypes = term.args.map((_) => M.createFreshVarType("A"))
      const retType = M.createFreshVarType("R")
      const arrowType = M.ArrowType(argTypes, retType)

      const unifyResult = M.checkUnify(
        ctx,
        term,
        targetInferred.type,
        arrowType,
      )
      if (M.isLeft(unifyResult)) return unifyResult

      const argCores: Array<C.Term> = []
      for (const [arg, argType] of arrayZip(term.args, argTypes)) {
        const argResult = M.check(mod, ctx, arg, argType)
        if (M.isLeft(argResult)) return argResult
        argCores.push(argResult.right)
      }

      // handle auto-currying
      if (M.isArrowType(targetInferred.type)) {
        const arity = targetInferred.type.argTypes.length
        if (arity === term.args.length) {
          return M.Right(
            M.Inferred(
              C.ApplyTerm(targetInferred.core, argCores, term.location),
              retType,
            ),
          )
        }

        // eta-expansion
        //
        // (iadd 1)
        //
        // ;; =>
        //
        // (lambda (curry.0)
        //   (iadd 1 curry.0))
        if (arity > term.args.length) {
          const usedNames = M.termOccurredNames(term)
          usedNames.add("curried")
          const curriedParameters = range(arity - term.args.length).map((i) => {
            const curriedParameter = M.generateRelativeFreshName(
              usedNames,
              "curried",
            )
            usedNames.add(curriedParameter)
            return curriedParameter
          })
          const curriedVars = curriedParameters.map((name) =>
            C.VarTerm(name, term.location),
          )
          return M.Right(
            M.Inferred(
              C.LambdaTerm(
                curriedParameters,
                C.ApplyTerm(
                  targetInferred.core,
                  [...argCores, ...curriedVars],
                  term.location,
                ),
                term.location,
              ),
              retType,
            ),
          )
        }

        // early-apply
        //
        // (define (adder n)
        //   (lambda (x)
        //     (iadd n x)))
        //
        // (adder 1 2)
        //
        // ;; =>
        //
        // ((adder 1) 2)
        if (arity < term.args.length) {
          return M.Right(
            M.Inferred(
              C.ApplyTerm(
                C.ApplyTerm(
                  targetInferred.core,
                  argCores.slice(0, arity),
                  term.location,
                ),
                argCores.slice(arity),
                term.location,
              ),
              retType,
            ),
          )
        }
      }

      return M.Right(
        M.Inferred(
          C.ApplyTerm(targetInferred.core, argCores, term.location),
          retType,
        ),
      )
    }

    case "LambdaTerm": {
      const argTypes = term.parameters.map((_) => M.createFreshVarType("A"))
      const retType = M.createFreshVarType("R")
      const type = M.ArrowType(argTypes, retType)
      const bodyResult = M.check(
        mod,
        M.ctxPutMany(ctx, term.parameters, argTypes),
        term.body,
        retType,
      )
      if (M.isLeft(bodyResult)) return bodyResult
      return M.Right(
        M.Inferred(
          C.LambdaTerm(term.parameters, bodyResult.right, term.location),
          type,
        ),
      )
    }

    case "TheTerm": {
      const type = M.evaluateType(mod, M.emptyEnv("OpaqueMode"), term.type)
      const checkResult = M.checkAssignable(mod, ctx, term.instance, type)
      if (M.isLeft(checkResult)) return checkResult
      return M.Right(M.Inferred(checkResult.right, type))
    }

    case "IfTerm": {
      const type = M.createFreshVarType("X")
      const conditionResult = M.check(
        mod,
        ctx,
        term.condition,
        M.AtomType("bool"),
      )
      if (M.isLeft(conditionResult)) return conditionResult
      const consequentResult = M.check(mod, ctx, term.consequent, type)
      if (M.isLeft(consequentResult)) return consequentResult
      const alternativeResult = M.check(mod, ctx, term.alternative, type)
      if (M.isLeft(alternativeResult)) return alternativeResult
      return M.Right({
        type,
        core: C.IfTerm(
          conditionResult.right,
          consequentResult.right,
          alternativeResult.right,
          term.location,
        ),
      })
    }

    case "Let1Term": {
      const rhsResult = M.infer(mod, ctx, term.rhs)
      if (M.isLeft(rhsResult)) return rhsResult
      const { type: rhsType, core: rhsCore } = rhsResult.right
      if (M.termIsSyntacticValue(term.rhs)) {
        ctx = M.substDeepWalkCtx(M.ctxSubst(ctx), ctx)
        let walkedType = M.substDeepWalk(M.ctxSubst(ctx), rhsType)
        walkedType = M.generalizeInCtx(ctx, walkedType)
        ctx = M.ctxPut(ctx, term.name, walkedType)
        const bodyResult = M.infer(mod, ctx, term.body)
        if (M.isLeft(bodyResult)) return bodyResult
        const { type: bodyType, core: bodyCore } = bodyResult.right
        return M.Right(
          M.Inferred(
            C.Let1Term(term.name, rhsCore, bodyCore, term.location),
            bodyType,
          ),
        )
      } else {
        ctx = M.ctxPut(ctx, term.name, rhsType)
        const bodyResult = M.infer(mod, ctx, term.body)
        if (M.isLeft(bodyResult)) return bodyResult
        const { type: bodyType, core: bodyCore } = bodyResult.right
        return M.Right(
          M.Inferred(
            C.Let1Term(term.name, rhsCore, bodyCore, term.location),
            bodyType,
          ),
        )
      }
    }

    case "Begin1Term": {
      const headResult = M.infer(mod, ctx, term.head)
      if (M.isLeft(headResult)) return headResult
      const { core: headCore } = headResult.right
      const bodyResult = M.infer(mod, ctx, term.body)
      if (M.isLeft(bodyResult)) return bodyResult
      const { type: bodyType, core: bodyCore } = bodyResult.right
      return M.Right(
        M.Inferred(C.Begin1Term(headCore, bodyCore, term.location), bodyType),
      )
    }

    case "ArrowTerm": {
      const type = M.TypeType()
      for (const argType of term.argTypes) {
        const result = M.check(mod, ctx, argType, type)
        if (M.isLeft(result)) return result
      }
      const retResult = M.check(mod, ctx, term.retType, type)
      if (M.isLeft(retResult)) return retResult
      return M.Right(M.Inferred(retResult.right, type))
    }

    case "PolymorphicTerm": {
      const type = M.TypeType()
      ctx = M.ctxPutMany(
        ctx,
        term.parameters,
        term.parameters.map(() => type),
      )
      const bodyResult = M.check(mod, ctx, term.body, type)
      if (M.isLeft(bodyResult)) return bodyResult
      return M.Right(M.Inferred(bodyResult.right, type))
    }
  }
}

function inferLookup(
  mod: M.Mod,
  ctx: M.Ctx,
  name: string,
  term: C.Term,
): M.Either<TypeError, Inferred> {
  if (ctx.transparentOpaqueNames.has(name)) {
    const claimedEntry = M.modLookupClaimedEntry(mod, name)
    if (claimedEntry) {
      const transparentType = M.evaluateType(
        mod,
        M.emptyEnv("TransparentMode"),
        claimedEntry.term,
      )
      return M.Right(M.Inferred(term, transparentType))
    }
  }

  const claimedType = M.modLookupClaimedType(mod, name)
  if (claimedType) {
    return M.Right(M.Inferred(term, claimedType))
  }

  const definition = M.modLookupDefinition(mod, name)
  if (definition === undefined) {
    let message = `undefined variable`
    message += `\n  package id: ${mod.pkg.id}`
    message += `\n  module name: ${mod.name}`
    message += `\n  name: ${name}`
    return M.Left({ term: term, message })
  }

  {
    // - when: inferLookup is called for B while checking A,
    //   and tryInferDefinitionBody has pre-allocated a fresh type
    //   variable for B, meaning B is in a mutual-recursive group with A.
    //   Return this fresh variable immediately to avoid infinite recursion.
    const inferredType = M.modLookupInferredType(mod, name)
    if (inferredType) {
      return M.Right(M.Inferred(term, inferredType))
    }
  }

  // - when: B is defined later in the module, so it has no pre-allocated
  //   type variable and no Inferred type yet.
  //   Check B on demand to obtain its type.
  //   This branch must come AFTER the mutual-recursion check above,
  //   otherwise checking a mutual-recursive group would loop infinitely.
  //
  // - We do NOT propagate the return value here,
  //   because the error message is already printed by definitionCheck,
  //   and outcome is tracked in DefinitionState for CheckPass.
  M.definitionCheck(definition)

  {
    // - when: after definitionCheck, tryInferDefinitionBody has stored
    //   B's Inferred type in mod.inferredTypes. Retrieve it.
    const inferredType = M.modLookupInferredType(mod, name)
    if (inferredType) {
      return M.Right(M.Inferred(term, inferredType))
    }
  }

  let message = `[typeInferLookup] internal error: infer fail after check`
  message += `\n  module name: ${mod.name}`
  message += `\n  name: ${name}`
  throw new S.ErrorWithSourceLocation(message, term.location)
}
