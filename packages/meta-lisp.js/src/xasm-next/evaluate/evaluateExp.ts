import * as S from "@xieyuheng/sexp.js"
import * as N from "../index.ts"

export function evaluateExp(mod: N.Mod, exp: N.Exp): N.Value {
  switch (exp.kind) {
    case "IntExp":
      return N.IntValue(exp.value)

    case "StringExp":
      return N.StringValue(exp.content)

    case "LabelExp":
      return N.LabelValue(exp.name, exp.path)

    case "StructExp": {
      const fields = new Map<string, N.Value>()
      for (const field of exp.fields) {
        fields.set(field.name, evaluateExp(mod, field.exp))
      }
      return N.StructValue(exp.name, fields)
    }

    case "PointerExp": {
      const target = evaluateExp(mod, exp.target)
      return N.PointerValue(target)
    }

    case "ApplyExp": {
      throw new S.ErrorWithSourceLocation(
        `[evaluateExp] ApplyExp is not supported in value position`,
        exp.location,
      )
    }

    case "VarExp": {
      throw new S.ErrorWithSourceLocation(
        `[evaluateExp] VarExp is not supported in value position`,
        exp.location,
      )
    }
  }
}
