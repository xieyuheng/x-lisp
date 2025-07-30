import { freshen } from "../../utils/name/freshen.ts"
import { apply } from "../evaluate/index.ts"
import { formatValue } from "../format/index.ts"
import * as Neutrals from "../value/index.ts"
import * as Values from "../value/index.ts"
import {
  lambdaIsDefined,
  lambdaSameDefined,
  type Neutral,
  type Value,
} from "../value/index.ts"
import { ctxBindName, ctxDepthAdd1, type Ctx } from "./Ctx.ts"

const debug = false

export function sameInCtx(ctx: Ctx, lhs: Value, rhs: Value): boolean {
  ctx = ctxDepthAdd1(ctx)

  if (debug) {
    console.log("[sameInCtx]", ctx.depth, " ", formatValue(lhs))
    console.log("[sameInCtx]", ctx.depth, "=", formatValue(rhs))
  }

  if (lhs.kind === "NotYet" && rhs.kind === "NotYet") {
    return sameNeutralInCtx(ctx, lhs.neutral, rhs.neutral)
  }

  if (lhs.kind === "Lambda" && rhs.kind === "Lambda") {
    if (lambdaSameDefined(lhs, rhs)) {
      return true
    }

    if (lambdaIsDefined(lhs) || lambdaIsDefined(rhs)) {
      return false
    }
  }

  if (lhs.kind === "Lambda" && !lambdaIsDefined(lhs)) {
    const freshName = freshen(ctx.boundNames, lhs.name)
    ctx = ctxBindName(ctx, freshName)
    const arg = Values.NotYet(Neutrals.Var(freshName))
    return sameInCtx(ctx, apply(lhs, arg), apply(rhs, arg))
  }

  if (rhs.kind === "Lambda" && !lambdaIsDefined(rhs)) {
    const freshName = freshen(ctx.boundNames, rhs.name)
    ctx = ctxBindName(ctx, freshName)
    const arg = Values.NotYet(Neutrals.Var(freshName))
    return sameInCtx(ctx, apply(lhs, arg), apply(rhs, arg))
  }

  return false
}

function sameNeutralInCtx(ctx: Ctx, lhs: Neutral, rhs: Neutral): boolean {
  if (lhs.kind === "Var" && rhs.kind === "Var") {
    return rhs.name === lhs.name
  }

  if (lhs.kind === "Apply" && rhs.kind === "Apply") {
    return (
      sameNeutralInCtx(ctx, lhs.target, rhs.target) &&
      sameInCtx(ctx, lhs.arg, rhs.arg)
    )
  }

  return false
}
