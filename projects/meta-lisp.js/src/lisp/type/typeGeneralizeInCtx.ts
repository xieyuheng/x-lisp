import { arrayDedup } from "@xieyuheng/helpers.js/array"
import * as L from "../index.ts"

function ctxFreeTypeVars(ctx: L.Ctx): Array<L.Value> {
    return arrayDedup(L.ctxTypes(ctx).flatMap((t) => L.typeFreeVars(new Set(), t)), L.typeVarEqual)
}
