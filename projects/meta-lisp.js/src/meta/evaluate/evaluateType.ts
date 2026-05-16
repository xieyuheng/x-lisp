import * as M from "../index.ts"
import { type Env } from "./Env.ts"
import type { EvaluationMode } from "./evaluate.ts"

export function evaluateType(
  mode: EvaluationMode,
  mod: M.Mod,
  env: Env,
  exp: M.Exp,
): M.Type {
  const value = M.evaluate(mode, mod, env, exp)
  if (!M.isTypeValue(value)) {
    let message = `[evaluateType] expected a type value`
    message += `\n  value kind: ${value.kind}`
    throw new Error(message)
  }
  return value.type
}
