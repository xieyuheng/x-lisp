import * as M from "../index.ts"
import { type Env } from "./Env.ts"

export function evaluateType(mod: M.Mod, env: Env, exp: M.Term): M.Type {
  const value = M.evaluate(mod, env, exp)
  if (!M.isTypeValue(value)) {
    let message = `[evaluateType] expected a type value`
    message += `\n  value kind: ${value.kind}`
    throw new Error(message)
  }
  return value.type
}
