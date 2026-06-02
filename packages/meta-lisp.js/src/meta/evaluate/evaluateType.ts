import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { type Env } from "./Env.ts"

export function evaluateType(mod: M.Mod, env: Env, exp: M.Term): M.Type {
  const value = M.evaluate(mod, env, exp)
  if (!M.isTypeValue(value)) {
    let message = `[evaluateType] value is not a type`
    message += `\n  value: ${M.formatValue(value)}`
    throw new S.ErrorWithSourceLocation(message, exp.location)
  }
  return value.type
}
