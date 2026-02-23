import * as L from "../index.ts"

function createCtxFromMod(mod: L.Mod): L.Ctx {
  let ctx = L.emptyCtx()

  for (const [name, definition] of mod.definitions.entries()) {
    if (definition.kind !== "TypeDefinition") {
      const type = L.modLookupClaimedType(definition.mod, definition.name)
      if (type) {
        ctx = L.ctxPut(ctx, name, type)
      } else {
        let message = `[createCtxFromMod] definition: ${name} has no claim\n`
        console.log(message)
        // throw new Error(message)
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
        L.typeCheck(ctx, definition.body, type)
      } else {
        let message = `[performTypeCheck] unclaimed definition`
        message += `\n  name: ${definition.name}`
        throw new Error(message)
      }
    }

    if (definition.kind === "FunctionDefinition") {
      const type = L.modLookupClaimedType(mod, definition.name)
      if (type) {
        L.typeCheck(
          ctx,
          L.Lambda(definition.parameters, definition.body, definition.meta),
          type,
        )
      } else {
        let message = `[performTypeCheck] unclaimed definition`
        message += `\n  name: ${definition.name}`
        throw new Error(message)
      }
    }
  }
}
