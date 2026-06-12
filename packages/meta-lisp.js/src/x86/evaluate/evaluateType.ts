import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function evaluateType(
  mod: X86.Mod,
  env: X86.Env,
  exp: X86.Exp,
): X86.Type {
  const value = X86.evaluate(mod, env, exp)
  if (!X86.isTypeValue(value)) {
    let message = `[evaluateType] expected a type, got: ${value.kind}`
    throw new S.ErrorWithSourceLocation(message, exp.location)
  }
  return value.type
}

export function evaluateTypeFields(
  mod: X86.Mod,
  env: X86.Env,
  fields: Array<X86.StructField>,
): Map<string, X86.Type> {
  const result = new Map<string, X86.Type>()
  for (const field of fields) {
    result.set(field.name, evaluateType(mod, env, field.exp))
  }
  return result
}
