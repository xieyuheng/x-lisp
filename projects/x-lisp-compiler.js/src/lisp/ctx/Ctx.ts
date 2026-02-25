import assert from "node:assert"
import { type Value } from "../value/index.ts"
import * as L from "../index.ts"

export type Ctx = Map<string, Value>

export function emptyCtx(): Ctx {
  return new Map()
}

export function ctxNames(ctx: Ctx): Set<string> {
  return new Set(ctx.keys())
}

export function ctxLookupType(ctx: Ctx, name: string): undefined | Value {
  const type = ctx.get(name)
  if (type === undefined) {
    return undefined
  }

  if (L.isPolymorphicType(type)) {
    return L.polymorphicTypeUnfold(type)
  }

  return type
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
