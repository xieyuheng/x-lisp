import { arrayDedup } from "@xieyuheng/std.js/array"
import assert from "node:assert"
import * as M from "../index.ts"

export type Ctx = {
  bindings: Map<string, M.Type>
  transparentOpaqueNames: Set<string>
  varTypes: Map<string, M.Type>
}

export function emptyCtx(): Ctx {
  return {
    bindings: new Map(),
    transparentOpaqueNames: new Set(),
    varTypes: new Map(),
  }
}

export function ctxNames(ctx: Ctx): Set<string> {
  return new Set(ctx.bindings.keys())
}

export function ctxTypes(ctx: Ctx): Array<M.Type> {
  return Array.from(ctx.bindings.values())
}

export function ctxLookupType(ctx: Ctx, name: string): undefined | M.Type {
  return ctx.bindings.get(name)
}

export function ctxPut(ctx: Ctx, name: string, type: M.Type): Ctx {
  return {
    ...ctx,
    bindings: new Map([...ctx.bindings, [name, type]]),
  }
}

export function ctxPutMany(
  ctx: Ctx,
  parameters: Array<string>,
  types: Array<M.Type>,
): Ctx {
  assert(parameters.length === types.length)
  for (const [index, name] of parameters.entries()) {
    ctx = ctxPut(ctx, name, types[index])
  }
  return ctx
}

export function ctxUpdate(base: Ctx, ctx: Ctx): Ctx {
  for (const name of ctxNames(ctx)) {
    const type = ctxLookupType(ctx, name)
    assert(type)
    base = ctxPut(base, name, type)
  }

  return base
}

export function ctxFreeVarTypes(ctx: Ctx): Array<M.Type> {
  return arrayDedup(
    M.ctxTypes(ctx).flatMap((t) => M.typeFreeVarTypes(new Set(), t)),
    M.varTypeEqual,
  )
}
