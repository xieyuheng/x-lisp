import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function evaluate(mod: X86.Mod, env: X86.Env, exp: X86.Exp): X86.Value {
  switch (exp.kind) {
    case "IntExp":
      return X86.IntValue(exp.value)

    case "StringExp":
      return X86.StringValue(exp.content)

    case "StructExp": {
      const fields = evaluateFields(mod, env, exp.fields)
      return X86.StructValue(exp.name, fields)
    }

    case "PointerExp": {
      const target = evaluate(mod, env, exp.target)
      return X86.PointerValue(target)
    }

    case "ArrayExp": {
      const elements = exp.elements.map((e) => evaluate(mod, env, e))
      return X86.ArrayValue(elements)
    }

    case "AddressExp": {
      const value = X86.envLookup(env, exp.name)
      if (value) return value

      const definition = X86.modLookupDefinition(mod, exp.name)
      if (definition) {
        return definitionToValue(definition)
      }

      let message = `[evaluate] unknown name: ${exp.name}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }
  }
}

export function evaluateFields(
  mod: X86.Mod,
  env: X86.Env,
  fields: Array<X86.StructField>,
): Map<string, X86.Value> {
  const result = new Map<string, X86.Value>()
  for (const field of fields) {
    result.set(field.name, evaluate(mod, env, field.exp))
  }
  return result
}

function definitionToValue(definition: X86.Definition): X86.Value {
  if (
    definition.kind === "StructDefinition" ||
    definition.kind === "PrimitiveTypeDefinition"
  ) {
    return X86.TypeValue(X86.NamedType(definition.name))
  }

  if (
    definition.kind === "DataDefinition" ||
    definition.kind === "CodeDefinition" ||
    definition.kind === "SpaceDefinition"
  ) {
    return X86.AddressValue(definition.name)
  }

  let message = `[definitionToValue] unexpected definition kind: ${definition.kind}`
  throw new S.ErrorWithSourceLocation(message, definition.location)
}
