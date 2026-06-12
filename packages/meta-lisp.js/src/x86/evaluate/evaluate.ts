import * as S from "@xieyuheng/sexp.js"
import * as N from "../index.ts"

export function evaluate(mod: N.Mod, exp: N.Exp): N.Value {
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
        fields.set(field.name, evaluate(mod, field.exp))
      }
      return N.StructValue(exp.name, fields)
    }

    case "PointerExp": {
      const target = evaluate(mod, exp.target)
      return N.PointerValue(target)
    }

    case "ApplyExp": {
      throw new S.ErrorWithSourceLocation(
        `[evaluate] ApplyExp is not supported in value position`,
        exp.location,
      )
    }

    case "VarExp": {
      throw new S.ErrorWithSourceLocation(
        `[evaluate] VarExp is not supported in value position`,
        exp.location,
      )
    }
  }
}
