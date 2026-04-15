import * as M from "../index.ts"
import { arrayDedup } from "@xieyuheng/helpers.js/array"

export function typeGeneralizeInCtx(ctx: M.Ctx, type: M.Value): M.Value {
  const freeVarTypesInCtx = M.ctxFreeVarTypes(ctx)
  const freeVarTypes = M.typeFreeVarTypes(new Set(), type).filter((varType) =>
    freeVarTypesInCtx.every((t) => !M.varTypeEqual(varType, t)),
  )
  if (freeVarTypes.length === 0) {
    return type
  } else {
    return M.polymorphicTypePrettifyVarTypes(
      M.createPolymorphicType(arrayDedup(freeVarTypes, M.varTypeEqual), type),
    )
  }
}
