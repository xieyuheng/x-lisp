import { writeln } from "@xieyuheng/helpers.js/file"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function definitionCheck(definition: M.Definition): null {
  if (definition.isChecked) {
    return null
  }

  const mod = definition.mod
  const name = definition.name

  if (mod.admitted.has(name)) {
    definition.isChecked = true
    return null
  }

  switch (definition.kind) {
    case "AlgebraicTypeDefinition": {
      for (const dataConstructor of definition.dataConstructors) {
        for (const field of dataConstructor.fields) {
          const exp =
            definition.typeConstructor.parameters.length === 0
              ? field.type
              : M.Lambda(
                  definition.typeConstructor.parameters,
                  field.type,
                  field.type.location ?? field.location,
                )
          tryCheckTypeExp(mod, exp)
        }
      }

      definition.isChecked = true
      return null
    }

    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      const type = M.modLookupClaimedType(mod, name)
      if (!type) {
        writeln(reportUnclaimedPrimitiveDefinition(definition))
        return null
      }

      definition.isChecked = true
      return null
    }

    case "VariableDefinition": {
      checkExp(mod, name, definition.body)
      definition.isChecked = true
      return null
    }

    case "TestDefinition": {
      checkExp(mod, name, definition.body)
      definition.isChecked = true
      return null
    }

    case "TypeDefinition": {
      if (definition.parameters.length === 0) {
        checkExp(mod, name, definition.body)
      } else {
        checkExp(
          mod,
          name,
          M.Lambda(definition.parameters, definition.body, definition.location),
        )
      }
      definition.isChecked = true
      return null
    }

    case "FunctionDefinition": {
      checkExp(
        mod,
        name,
        M.Lambda(definition.parameters, definition.body, definition.location),
      )
      definition.isChecked = true
      return null
    }

    case "OpaqueTypeDefinition": {
      for (const entry of definition.interfaceEntries) {
        const exp =
          definition.typeConstructor.parameters.length === 0
            ? entry.type
            : M.Lambda(
                definition.typeConstructor.parameters,
                entry.type,
                entry.type.location ?? entry.location,
              )
        tryCheckTypeExp(mod, exp)
      }

      const reprExp =
        definition.typeConstructor.parameters.length === 0
          ? definition.representationType
          : M.Lambda(
              definition.typeConstructor.parameters,
              definition.representationType,
              definition.representationType.location,
            )
      tryCheckTypeExp(mod, reprExp)

      definition.isChecked = true
      return null
    }
  }
}

function tryCheckTypeExp(mod: M.Mod, exp: M.Exp): void {
  const type = M.TypeType()
  const effect = M.checkAssignable(mod, M.emptyCtx(), exp, type)
  const result = effect(M.emptySubst())
  if (result.kind === "CheckError") {
    writeln(reportTypeCheckError(result.exp, result.message))
  }
}

function checkExp(mod: M.Mod, name: string, exp: M.Exp): void {
  const opaqueTypeExp = mod.opaqueClaimed.get(name)
  if (opaqueTypeExp) {
    const opaqueType = M.evaluateType(
      "TransparentMode",
      mod,
      M.emptyEnv(),
      opaqueTypeExp,
    )
    const opaqueNames = findOpaqueNamesByInterfaceName(mod, name) ?? new Set()
    const ctx = M.emptyCtx()
    ctx.transparentOpaqueNames = opaqueNames
    const effect = M.checkAssignable(mod, ctx, exp, opaqueType)
    const result = effect(M.emptySubst())
    if (result.kind === "CheckError") {
      writeln(reportTypeCheckError(result.exp, result.message))
    }
    return
  }

  const type = M.modLookupClaimedType(mod, name)
  if (type) {
    const effect = M.checkAssignable(mod, M.emptyCtx(), exp, type)
    const result = effect(M.emptySubst())
    if (result.kind === "CheckError") {
      writeln(reportTypeCheckError(result.exp, result.message))
    }
  } else {
    const freshVarType = M.createFreshVarType(name)
    // - for recursive function
    const ctx = M.ctxPut(M.emptyCtx(), name, freshVarType)
    // - for mutual recursive function
    M.modPutInferredType(mod, name, freshVarType)
    const effect = M.infer(mod, ctx, exp)
    const result = effect(M.emptySubst())
    if (result.kind === "InferError") {
      writeln(reportTypeCheckError(result.exp, result.message))
    } else {
      let inferredType = M.substDeepWalk(result.subst, result.type)
      inferredType = M.generalizeInCtx(M.emptyCtx(), inferredType)
      M.modPutInferredType(mod, name, inferredType)
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

function reportTypeCheckError(exp: M.Exp, errorMessage: string): string {
  if (exp.location) {
    return S.sourceLocationReport(exp.location, errorMessage)
  } else {
    let message = `-- ${errorMessage}`
    message += `\n  exp: ${M.formatExp(exp)}`
    return message
  }
}

function reportUnclaimedPrimitiveDefinition(definition: M.Definition): string {
  const errorMessage = `unclaimed primitive definition: ${definition.name}`
  if (definition.location) {
    return S.sourceLocationReport(definition.location, errorMessage)
  } else {
    return `${definition.mod.name} -- ${errorMessage}`
  }
}
