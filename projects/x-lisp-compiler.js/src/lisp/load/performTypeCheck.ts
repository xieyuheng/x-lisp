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

  switch (definition.kind) {
    case "TypeDefinition":
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
      const type = L.modLookupType(mod, definition.name)
      if (!type) {
        console.log(reportUnclaimedDefinition(definition))
        return null
      }

      const effect = L.typeCheck(mod, L.emptyCtx(), definition.body, type)
      const result = effect(L.emptySubst())
      if (result.kind === "CheckError") {
        console.log(reportTypeCheckError(result.exp, result.message))
      }
      return null
    }

    case "FunctionDefinition": {
      const type = L.modLookupType(mod, definition.name)
      if (!type) {
        console.log(reportUnclaimedDefinition(definition))
        return null
      }

      const lambdaExp = L.Lambda(
        definition.parameters,
        definition.body,
        definition.meta,
      )
      const effect = L.typeCheck(mod, L.emptyCtx(), lambdaExp, type)
      const result = effect(L.emptySubst())
      if (result.kind === "CheckError") {
        console.log(reportTypeCheckError(result.exp, result.message))
      }
      return null
    }
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
