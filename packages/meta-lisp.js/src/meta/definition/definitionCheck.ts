import * as S from "@xieyuheng/sexp.js"
import { writeln } from "@xieyuheng/std.js/file"
import * as C from "../../core/index.ts"
import * as M from "../index.ts"

// definitionCheck is the single point where a definition's types are checked.
// It is called from two places with distinct responsibilities:
//
//   - CheckPass (080-CheckPass.ts):
//       Eager pass that iterates all definitions in all modules.
//       This is the "official" type checking pass.
//
//   - inferLookup (check/infer.ts):
//       Lazy fallback during type inference.
//       When checking definition A that references definition B,
//       and B hasn't been checked yet (B appears later in the iteration order),
//       inferLookup calls definitionCheck(B) on demand.
//       This avoids requiring definitions to be in topological order.
//
// definitionCheck is idempotent — once isChecked is set,
// subsequent calls return immediately.

export function definitionCheck(definition: M.Definition): M.Outcome {
  const mod = definition.mod
  const name = definition.name

  // - When definitionCheck returns "OutcomeError", modMarkChecked is still called,
  //   so a subsequent call finds isChecked and returns early.
  //   But if the earlier call was from inferLookup (infer.ts), its return
  //   value was discarded — the error would be lost.
  //   By checking outcome here, CheckPass still learns about any
  //   error discovered during on-demand checking.
  if (M.modIsChecked(mod, name)) {
    return M.modOutcome(mod, name)
  }

  switch (definition.kind) {
    case "AlgebraicTypeDefinition": {
      let outcome: M.Outcome = "OutcomeOk"

      for (const dataConstructor of definition.dataConstructors) {
        for (const field of dataConstructor.fields) {
          if (
            tryCheckTypeTerm(
              mod,
              field.type,
              definition.typeConstructor.parameters,
            ) === null
          )
            outcome = "OutcomeError"
        }
      }

      M.modMarkChecked(mod, name)
      if (outcome === "OutcomeError")
        M.modMarkOutcome(mod, name, "OutcomeError")
      return outcome
    }

    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration": {
      const type = M.modLookupClaimedType(mod, name)
      if (!type) {
        const errorMessage = `unclaimed primitive definition: ${definition.name}`
        writeln(S.sourceLocationReport(definition.location, errorMessage))
        // Even for unclaimed primitive, it is not a CheckError:
        // the error is about missing claim, not type mismatch.
        // We still set checked to avoid repeating.
      }

      M.modMarkChecked(mod, name)
      return "OutcomeOk"
    }

    case "VariableDefinition":
    case "TestDefinition": {
      const outcome = tryCheckDefinitionBody(
        mod,
        definition,
        name,
        definition.body,
      )
      M.modMarkChecked(mod, name)
      if (outcome === "OutcomeError")
        M.modMarkOutcome(mod, name, "OutcomeError")
      return outcome
    }

    case "TypeDefinition": {
      const body =
        definition.parameters.length === 0
          ? definition.body
          : M.LambdaTerm(
              definition.parameters,
              definition.body,
              definition.location,
            )
      const outcome = tryCheckDefinitionBody(mod, definition, name, body)
      M.modMarkChecked(mod, name)
      if (outcome === "OutcomeError")
        M.modMarkOutcome(mod, name, "OutcomeError")
      return outcome
    }

    case "FunctionDefinition": {
      const body = M.LambdaTerm(
        definition.parameters,
        definition.body,
        definition.location,
      )
      const outcome = tryCheckDefinitionBody(mod, definition, name, body)
      M.modMarkChecked(mod, name)
      if (outcome === "OutcomeError")
        M.modMarkOutcome(mod, name, "OutcomeError")
      return outcome
    }

    case "OpaqueTypeDefinition": {
      let outcome: M.Outcome = "OutcomeOk"

      for (const entry of definition.interfaceEntries) {
        if (
          tryCheckTypeTerm(
            mod,
            entry.type,
            definition.typeConstructor.parameters,
          ) === null
        )
          outcome = "OutcomeError"
      }

      if (
        tryCheckTypeTerm(
          mod,
          definition.representationType,
          definition.typeConstructor.parameters,
        ) === null
      )
        outcome = "OutcomeError"

      M.modMarkChecked(mod, name)
      if (outcome === "OutcomeError")
        M.modMarkOutcome(mod, name, "OutcomeError")
      return outcome
    }
  }
}

function tryCheckTerm(
  mod: M.Mod,
  ctx: M.Ctx,
  exp: M.Term,
  type: M.Type,
): C.Term | null {
  const result = M.checkAssignable(mod, ctx, exp, type)
  if (M.isLeft(result)) {
    writeln(
      S.sourceLocationReport(result.left.term.location, result.left.message),
    )
    return null
  }
  return result.right
}

function tryCheckTypeTerm(
  mod: M.Mod,
  exp: M.Term,
  typeParameters: Array<string>,
): C.Term | null {
  let ctx = M.emptyCtx()
  for (const name of typeParameters) {
    ctx = M.ctxPut(ctx, name, M.TypeType())
  }
  return tryCheckTerm(mod, ctx, exp, M.TypeType())
}

function tryCheckDefinitionBody(
  mod: M.Mod,
  definition: M.Definition,
  name: string,
  exp: M.Term,
): M.Outcome {
  if (mod.admitted.has(name)) {
    return tryInferDefinitionBody(mod, definition, name, exp)
  }

  if (mod.opaque.has(name)) {
    const claimedEntry = M.modLookupClaimedEntry(mod, name)
    if (claimedEntry) {
      // - why: to check the body of an opaque function,
      //   we need to use the transparent type.
      //   when lookup type of interface function
      //   that belongs to the same opaque type definition,
      //   transparent type need to be used.
      const transparentType = M.evaluateType(
        mod,
        M.emptyEnv("TransparentMode"),
        claimedEntry.term,
      )
      const opaqueNames = findOpaqueNamesByInterfaceName(mod, name) ?? new Set()
      const ctx = M.emptyCtx()
      ctx.transparentOpaqueNames = opaqueNames
      const core = tryCheckTerm(mod, ctx, exp, transparentType)
      if (!core) return "OutcomeError"
      storeCoreTerm(mod, definition, core)
      return "OutcomeOk"
    }
  }

  const type = M.modLookupClaimedType(mod, name)
  if (type) {
    const ctx = M.emptyCtx()
    const core = tryCheckTerm(mod, ctx, exp, type)
    if (!core) return "OutcomeError"
    storeCoreTerm(mod, definition, core)
    return "OutcomeOk"
  }

  return tryInferDefinitionBody(mod, definition, name, exp)
}

function tryInferDefinitionBody(
  mod: M.Mod,
  definition: M.Definition,
  name: string,
  exp: M.Term,
): M.Outcome {
  const freshVarType = M.createFreshVarType(name)
  // - why: for recursive function — put `name -> freshVarType`
  //   into ctx so that the function body can refer to itself recursively.
  const ctx = M.ctxPut(M.emptyCtx(), name, freshVarType)
  // - why: for mutual recursive function — reserve a placeholder
  //   in mod.inferredTypes for peers to find during type inference.
  //   It will be overwritten with the actual inferred type on success.
  M.modPutInferredType(mod, name, freshVarType)
  const result = M.infer(mod, ctx, exp)
  if (M.isLeft(result)) {
    writeln(
      S.sourceLocationReport(result.left.term.location, result.left.message),
    )
    return "OutcomeError"
  } else {
    const core = result.right.core
    storeCoreTerm(mod, definition, core)
    let inferredType = M.substDeepWalk(M.ctxSubst(ctx), result.right.type)
    inferredType = M.generalizeInCtx(M.emptyCtx(), inferredType)
    M.modPutInferredType(mod, name, inferredType)
    return "OutcomeOk"
  }
}

function storeCoreTerm(
  mod: M.Mod,
  definition: M.Definition,
  core: C.Term,
): void {
  switch (definition.kind) {
    case "FunctionDefinition": {
      if (core.kind !== "LambdaTerm") {
        throw new Error(
          `[storeCoreTerm] expected LambdaTerm for FunctionDefinition`,
        )
      }
      let n = definition.parameters.length
      if (n === 0) n = 1
      let body: C.Term = core
      for (let i = 0; i < n; i++) {
        if (body.kind !== "LambdaTerm") break
        body = body.body
      }
      M.modPutCoreTerm(mod, definition.name, body)
      return
    }
    case "TypeDefinition": {
      if (core.kind === "LambdaTerm") {
        let n = definition.parameters.length
        if (n === 0) n = 1
        let body: C.Term = core
        for (let i = 0; i < n; i++) {
          if (body.kind !== "LambdaTerm") break
          body = body.body
        }
        M.modPutCoreTerm(mod, definition.name, body)
      } else {
        M.modPutCoreTerm(mod, definition.name, core)
      }
      return
    }
    case "VariableDefinition":
    case "TestDefinition": {
      M.modPutCoreTerm(mod, definition.name, core)
      return
    }
    default: {
      throw new Error(
        `[storeCoreTerm] unexpected definition kind: ${definition.kind}`,
      )
    }
  }
}

function findOpaqueNamesByInterfaceName(
  mod: M.Mod,
  name: string,
): Set<string> | undefined {
  for (const definition of mod.definitions.values()) {
    if (definition.kind === "OpaqueTypeDefinition") {
      const entry = definition.interfaceEntries.find((e) => e.name === name)
      if (entry) {
        return new Set(definition.interfaceEntries.map((e) => e.name))
      }
    }
  }

  return undefined
}
