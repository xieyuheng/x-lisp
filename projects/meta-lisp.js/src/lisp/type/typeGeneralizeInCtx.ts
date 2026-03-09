import * as L from "../index.ts"

export function typeGeneralizeInCtx(ctx: L.Ctx, type: L.Value): L.Value {
  return L.createPolymorphicType([], type)
}
