import assert from "node:assert"
import { type Value } from "../value/index.ts"

export type Ctx = Map<string, Value>

export function emptyCtx(): Ctx {
  return new Map()
}

export function ctxNames(ctx: Ctx): Set<string> {
  return new Set(ctx.keys())
}

export function ctxLookupValue(ctx: Ctx, name: string): undefined | Value {
  return ctx.get(name)
}

export function ctxPut(ctx: Ctx, name: string, value: Value): Ctx {
  return new Map([...ctx, [name, value]])
}

export function ctxUpdate(base: Ctx, ctx: Ctx): Ctx {
  for (const name of ctxNames(ctx)) {
    const value = ctxLookupValue(ctx, name)
    assert(value)
    base = ctxPut(base, name, value)
  }

  return base
}
