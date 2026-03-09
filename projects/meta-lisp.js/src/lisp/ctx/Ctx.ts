import { arrayDedup } from "@xieyuheng/helpers.js/array"
import assert from "node:assert"
import * as L from "../index.ts"
import { type Value } from "../value/index.ts"

export type Ctx = Map<string, Value>

export function emptyCtx(): Ctx {
  return new Map()
}

export function ctxNames(ctx: Ctx): Set<string> {
  return new Set(ctx.keys())
}

export function ctxTypes(ctx: Ctx): Array<Value> {
  return Array.from(ctx.values())
}

export function ctxLookupType(ctx: Ctx, name: string): undefined | Value {
  return ctx.get(name)
}

export function ctxPut(ctx: Ctx, name: string, value: Value): Ctx {
  return new Map([...ctx, [name, value]])
}

export function ctxPutMany(
  ctx: Ctx,
  parameters: Array<string>,
  values: Array<Value>,
): Ctx {
  assert(parameters.length === values.length)
  for (const [index, name] of parameters.entries()) {
    ctx = ctxPut(ctx, name, values[index])
  }
  return ctx
}

export function ctxUpdate(base: Ctx, ctx: Ctx): Ctx {
  for (const name of ctxNames(ctx)) {
    const value = ctxLookupType(ctx, name)
    assert(value)
    base = ctxPut(base, name, value)
  }

  return base
}

function ctxFreeTypeVars(ctx: Ctx): Array<Value> {
  return arrayDedup(
    L.ctxTypes(ctx).flatMap((t) => L.typeFreeVars(new Set(), t)),
    L.typeVarEqual,
  )
}
