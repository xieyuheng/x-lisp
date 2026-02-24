import { urlRelativeToCwd } from "@xieyuheng/helpers.js/url"
import * as L from "../index.ts"

function createCtxFromMod(mod: L.Mod): L.Ctx {
  let ctx = L.emptyCtx()

  for (const [name, definition] of mod.definitions.entries()) {
    if (definition.kind !== "TypeDefinition") {
      const type = L.modLookupClaimedType(definition.mod, definition.name)
      if (type) {
        ctx = L.ctxPut(ctx, name, type)
      } else {
        let message = `${urlRelativeToCwd(mod.url)} - unclaimed definition: ${name}`
        // console.error(message)
      }
    }
  }

  return ctx
}

export function performTypeCheck(mod: L.Mod): void {
  const ctx = createCtxFromMod(mod)

  for (const definition of L.modOwnDefinitions(mod)) {
    if (definition.kind === "VariableDefinition") {
      const type = L.modLookupClaimedType(mod, definition.name)
      if (type) {
        const result = L.typeCheck(ctx, definition.body, type)(L.emptySubst())
        if (result.kind === "CheckError") {
          let message = `${urlRelativeToCwd(mod.url)} - fail to check: ${definition.name}`
          message += result.message
          console.error(message)
        }
      } else {
        let message = `${urlRelativeToCwd(mod.url)} - unclaimed definition: ${definition.name}`
        console.error(message)
      }
    }

    if (definition.kind === "FunctionDefinition") {
      const type = L.modLookupClaimedType(mod, definition.name)
      if (type) {
        const result = L.typeCheck(
          ctx,
          L.Lambda(definition.parameters, definition.body, definition.meta),
          type,
        )(L.emptySubst())
        if (result.kind === "CheckError") {
          let message = `${urlRelativeToCwd(mod.url)} - fail to check: ${definition.name}`
          message += result.message
          console.error(message)
        }
      } else {
        let message = `${urlRelativeToCwd(mod.url)} - unclaimed definition: ${definition.name}`
        console.error(message)
      }
    }
  }
}
