import assert from "node:assert"
import * as L from "../index.ts"

export function typeCheck(ctx: L.Ctx, exp: L.Exp, type: L.Value): void {
  // TODO

  L.typeSubtype([], L.typeInfer(ctx, exp), type)
}
