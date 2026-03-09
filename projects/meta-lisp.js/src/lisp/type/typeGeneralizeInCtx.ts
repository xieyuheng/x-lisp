import * as L from "../index.ts"

function ctxFreeTypeVars(ctx: L.Ctx): Array<L.Value> {
  return L.ctxTypes(ctx).flatMap((t) => L.typeFreeVars(new Set(), t))
}
