import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function evaluate(mod: X86.Mod, exp: X86.Exp): X86.Value {
  switch (exp.kind) {
    case "IntExp":
      return X86.IntValue(exp.value)

    case "StringExp":
      return X86.StringValue(exp.content)

    case "LabelExp":
      return X86.LabelValue(exp.name, exp.path)

    case "StructExp": {
      const fields = evaluateFields(mod, exp.fields)
      return X86.StructValue(exp.name, fields)
    }

    case "PointerExp": {
      const target = evaluate(mod, exp.target)
      return X86.PointerValue(target)
    }

    case "ApplyExp": {
      let message = `[evaluate] ApplyExp is not supported in value position`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    case "VarExp": {
      let message = `[evaluate] VarExp is not supported in value position`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }
  }
}

export function evaluateFields(
  mod: X86.Mod,
  fields: Array<X86.StructField>,
): Map<string, X86.Value> {
  const result = new Map<string, X86.Value>()
  for (const field of fields) {
    result.set(field.name, evaluate(mod, field.exp))
  }
  return result
}
