import { urlRelativeToCwd } from "@xieyuheng/helpers.js/url"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"

export function performTypeCheck(mod: L.Mod): void {
  for (const [name, claimed] of mod.claimed) {
    const type = L.modLookupType(mod, name)
    if (!type) {
      console.log(reportUndefinedClaim(claimed.exp))
      continue
    }
  }

  for (const definition of L.modOwnDefinitions(mod)) {
    checkDefinition(definition)
  }
}

function checkDefinition(definition: L.Definition): null {
  const mod = definition.mod

  if (mod.exempted.has(definition.name)) {
    return null
  }

  switch (definition.kind) {
    case "DatatypeDefinition": {
      return null
    }

    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      const type = L.modLookupType(mod, definition.name)
      if (!type) {
        console.log(reportUnclaimedDefinition(definition))
        return null
      }

      return null
    }

    case "VariableDefinition": {
      const exp = definition.body
      const type = L.modLookupClaimedType(mod, definition.name)
      if (type) {
        checkClaimedType(mod, exp, type)
        return null
      }

      checkByInfer(mod, definition.name, exp)
      return null
    }

    case "FunctionDefinition": {
      const exp = L.Lambda(
        definition.parameters,
        definition.body,
        definition.meta,
      )
      const type = L.modLookupClaimedType(mod, definition.name)
      if (type) {
        checkClaimedType(mod, exp, type)
        return null
      }

      checkByInfer(mod, definition.name, exp)
      return null
    }
  }
}

function checkClaimedType(mod: L.Mod, exp: L.Exp, type: L.Value): void {
  const effect = L.typeCheckAssignable(mod, L.emptyCtx(), exp, type)
  const result = effect(L.emptySubst())
  if (result.kind === "CheckError") {
    console.log(reportTypeCheckError(result.exp, result.message))
  }
}

function checkByInfer(mod: L.Mod, name: string, exp: L.Exp): void {
  const effect = L.typeInfer(mod, L.emptyCtx(), exp)
  const result = effect(L.emptySubst())
  if (result.kind === "InferError") {
    console.log(reportTypeCheckError(result.exp, result.message))
  } else {
    let inferredType = L.substApplyToType(result.subst, result.type)
    inferredType = L.typeGeneralizeInCtx(L.emptyCtx(), inferredType)
    L.modPutInferredType(mod, name, inferredType)
  }
}

function reportTypeCheckError(exp: L.Exp, errorMessage: string): string {
  if (exp.meta) {
    return S.tokenMetaReport(exp.meta, errorMessage)
  } else {
    let message = `-- ${errorMessage}`
    message += `\n  exp: ${L.formatExp(exp)}`
    return message
  }
}

function reportUndefinedClaim(exp: L.Exp): string {
  return reportTypeCheckError(exp, "undefined claim")
}

function reportUnclaimedDefinition(definition: L.Definition): string {
  const errorMessage = `unclaimed definition: ${definition.name}`
  if (definition.meta) {
    return S.tokenMetaReport(definition.meta, errorMessage)
  } else {
    return `${urlRelativeToCwd(definition.mod.url)} -- ${errorMessage}`
  }
}
