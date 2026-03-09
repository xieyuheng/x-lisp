import { arrayDedup } from "@xieyuheng/helpers.js/array"
import { mapMapValue } from "@xieyuheng/helpers.js/map"
import * as L from "../index.ts"

function substApplyToCtx(subst: L.Subst, ctx: L.Ctx): L.Ctx {
  return mapMapValue(ctx, (t) => L.substApplyToType(subst, t))
}

function ctxFreeTypeVars(ctx: L.Ctx): Array<L.Value> {
  return arrayDedup(
    L.ctxTypes(ctx).flatMap((t) => L.typeFreeVars(new Set(), t)),
    L.typeVarEqual,
  )
}
