import { arrayDedup } from "@xieyuheng/helpers.js/array"
import * as L from "../index.ts"

export function typeGeneralizeInCtx(ctx: L.Ctx, type: L.Value): L.Value {
  const freeVarTypesInCtx = L.ctxFreeVarTypes(ctx)
  const freeVarTypes = L.typeFreeVarTypes(new Set(), type).filter((varType) =>
    freeVarTypesInCtx.every((t) => !L.varTypeEqual(varType, t)),
  )
  if (freeVarTypes.length === 0) {
    return type
  } else {
    return L.createPolymorphicType(
      arrayDedup(freeVarTypes, L.varTypeEqual),
      type,
    )
  }
}
