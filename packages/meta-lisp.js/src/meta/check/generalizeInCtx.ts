import { arrayDedup } from "@xieyuheng/helpers.js/array"
import * as M from "../index.ts"

export function generalizeInCtx(ctx: M.Ctx, type: M.Type): M.Type {
  const freeVarTypesInCtx = M.ctxFreeVarTypes(ctx)
  const freeVarTypes = M.typeFreeVarTypes(new Set(), type).filter((varType) =>
    freeVarTypesInCtx.every((t) => !M.varTypeEqual(varType, t)),
  )
  if (freeVarTypes.length === 0) {
    return type
  } else {
    const dedupedVarTypes = arrayDedup(freeVarTypes, M.varTypeEqual).filter(
      (t): t is M.VarType => t.kind === "VarType",
    )
    return M.polymorphicTypePrettifyVarTypes(
      M.PolymorphicType(dedupedVarTypes, type),
    )
  }
}
