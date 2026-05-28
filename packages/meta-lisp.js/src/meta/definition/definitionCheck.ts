import { writeln } from "@xieyuheng/helpers.js/file"
import * as S from "@xieyuheng/sexp.js"
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

export function definitionCheck(definition: M.Definition): null {
  const mod = definition.mod
  const name = definition.name

  if (M.modIsChecked(mod, name)) {
    return null
  }

  if (mod.admitted.has(name)) {
    M.modSetChecked(mod, name)
    return null
  }

  switch (definition.kind) {
    case "AlgebraicTypeDefinition": {
      for (const dataConstructor of definition.dataConstructors) {
        for (const field of dataConstructor.fields) {
          tryCheckTypeTerm(
            mod,
            field.type,
            definition.typeConstructor.parameters,
          )
        }
      }

      M.modSetChecked(mod, name)
      return null
    }

    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      const type = M.modLookupClaimedType(mod, name)
      if (!type) {
        const errorMessage = `unclaimed primitive definition: ${definition.name}`
        writeln(S.sourceLocationReport(definition.location, errorMessage))
        return null
      }

      M.modSetChecked(mod, name)
      return null
    }

    case "VariableDefinition":
    case "TestDefinition": {
      if (!tryCheckDefinitionBody(mod, name, definition.body)) {
        tryInferDefinitionBody(mod, name, definition.body)
      }
      M.modSetChecked(mod, name)
      return null
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
      if (!tryCheckDefinitionBody(mod, name, body)) {
        tryInferDefinitionBody(mod, name, body)
      }
      M.modSetChecked(mod, name)
      return null
    }

    case "FunctionDefinition": {
      const body = M.LambdaTerm(
        definition.parameters,
        definition.body,
        definition.location,
      )
      if (!tryCheckDefinitionBody(mod, name, body)) {
        tryInferDefinitionBody(mod, name, body)
      }
      M.modSetChecked(mod, name)
      return null
    }

    case "OpaqueTypeDefinition": {
      for (const entry of definition.interfaceEntries) {
        tryCheckTypeTerm(mod, entry.type, definition.typeConstructor.parameters)
      }

      tryCheckTypeTerm(
        mod,
        definition.representationType,
        definition.typeConstructor.parameters,
      )

      M.modSetChecked(mod, name)
      return null
    }
  }
}

function tryCheckTerm(mod: M.Mod, ctx: M.Ctx, exp: M.Term, type: M.Type): void {
  const effect = M.checkAssignable(mod, ctx, exp, type)
  const result = effect(M.emptySubst())
  if (result.kind === "CheckError") {
    writeln(S.sourceLocationReport(result.exp.location, result.message))
  }
}

function tryCheckTypeTerm(
  mod: M.Mod,
  exp: M.Term,
  typeParameters: Array<string>,
): void {
  let ctx = M.emptyCtx()
  for (const name of typeParameters) {
    ctx = M.ctxPut(ctx, name, M.TypeType())
  }
  tryCheckTerm(mod, ctx, exp, M.TypeType())
}

function tryCheckDefinitionBody(
  mod: M.Mod,
  name: string,
  exp: M.Term,
): boolean {
  const opaqueTypeExp = mod.opaqueClaimed.get(name)
  if (opaqueTypeExp) {
    const opaqueType = M.evaluateType(
      mod,
      M.emptyEnv("TransparentMode"),
      opaqueTypeExp,
    )
    const opaqueNames = findOpaqueNamesByInterfaceName(mod, name) ?? new Set()
    const ctx = M.emptyCtx()
    ctx.transparentOpaqueNames = opaqueNames
    tryCheckTerm(mod, ctx, exp, opaqueType)
    return true
  }

  const type = M.modLookupClaimedType(mod, name)
  if (type) {
    tryCheckTerm(mod, M.emptyCtx(), exp, type)
    return true
  }

  return false
}

function tryInferDefinitionBody(mod: M.Mod, name: string, exp: M.Term): void {
  const freshVarType = M.createFreshVarType(name)
  // - why: for recursive function — put `name -> freshVarType`
  //   into ctx so that the function body can refer to itself recursively.
  const ctx = M.ctxPut(M.emptyCtx(), name, freshVarType)
  // - why: for mutual recursive function — reserve a placeholder
  //   in mod.inferredTypes for peers to find during type inference.
  //   It will be overwritten with the actual inferred type on success.
  M.modPutInferredType(mod, name, freshVarType)
  const effect = M.infer(mod, ctx, exp)
  const result = effect(M.emptySubst())
  if (result.kind === "InferError") {
    writeln(S.sourceLocationReport(result.exp.location, result.message))
  } else {
    let inferredType = M.substDeepWalk(result.subst, result.type)
    inferredType = M.generalizeInCtx(M.emptyCtx(), inferredType)
    M.modPutInferredType(mod, name, inferredType)
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
