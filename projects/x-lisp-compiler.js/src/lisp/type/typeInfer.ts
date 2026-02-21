import * as L from "../index.ts"

export function typeInfer(ctx: L.Ctx, exp: L.Exp): L.Value {
  switch (exp.kind) {
    case "Symbol": {
      return L.createAtomType("symbol")
    }
    case "Hashtag": {
      return L.createAtomType("hashtag")
    }
    case "String": {
      return L.createAtomType("string")
    }
    case "Int": {
      return L.createAtomType("int")
    }
    case "Float": {
      return L.createAtomType("float")
    }

    // case "Var": {}
    // case "Lambda": {}
    // case "Apply": {}
    // case "Let1": {}
    // case "Begin1": {}
    // case "BeginSugar": {}
    // case "AssignSugar": {}
    // case "If": {}
    // case "When": {}
    // case "Unless": {}
    // case "And": {}
    // case "Or": {}
    // case "Cond": {}
    // case "Tael": {}
    // case "Set": {}
    // case "Hash": {}
    // case "Quote": {}

    default: {
      let message = `[typeInfer] unhandled exp`
      message += `\n  exp: ${L.formatExp(exp)}`
      throw new Error(message)
    }
  }
}
