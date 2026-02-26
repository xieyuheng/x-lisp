import { urlRelativeToCwd } from "@xieyuheng/helpers.js/url"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"

export function performTypeCheck(mod: L.Mod): void {
  const ctx = createCtxFromMod(mod)

  for (const definition of L.modOwnDefinitions(mod)) {
    if (definition.kind === "VariableDefinition") {
      const type = L.ctxLookupType(ctx, definition.name)
      if (!type) {
        console.log(reportUnclaimedDefinition(definition))
        continue
      }

      const effect = L.typeCheck(mod, ctx, definition.body, type)
      const result = effect(L.emptySubst())
      if (result.kind === "CheckError") {
        console.log(reportTypeCheckError(result.exp, result.message))
      }
    }

    if (definition.kind === "FunctionDefinition") {
      const type = L.ctxLookupType(ctx, definition.name)
      if (!type) {
        console.log(reportUnclaimedDefinition(definition))
        continue
      }

      const lambdaExp = L.Lambda(
        definition.parameters,
        definition.body,
        definition.meta,
      )
      const effect = L.typeCheck(mod, ctx, lambdaExp, type)
      const result = effect(L.emptySubst())
      if (result.kind === "CheckError") {
        console.log(reportTypeCheckError(result.exp, result.message))
      }
    }
  }
}

function createCtxFromMod(mod: L.Mod): L.Ctx {
  let ctx = L.emptyCtx()
  for (const [name, definition] of mod.definitions.entries()) {
    if (
      definition.kind === "TypeDefinition" ||
      definition.kind === "DatatypeDefinition"
    ) {
      continue
    }

    const type = L.modLookupClaimedType(definition.mod, definition.name)
    if (!type) {
      console.log(reportUnclaimedDefinition(definition))
      continue
    }

    ctx = L.ctxPut(ctx, name, type)
  }

  for (const [name, claimed] of mod.claimed) {
    const type = L.ctxLookupType(ctx, name)
    if (!type) {
      console.log(reportUndefinedClaim(claimed.exp))
      continue
    }
  }

  return ctx
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
