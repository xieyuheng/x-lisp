import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function evaluate(mod: X86.Mod, env: X86.Env, exp: X86.Exp): X86.Value {
  switch (exp.kind) {
    case "IntExp":
      return X86.IntValue(exp.value)

    case "StringExp":
      return X86.StringValue(exp.content)

    case "AddressExp":
      return X86.AddressValue(exp.name, exp.path)

    case "StructExp": {
      const fields = evaluateFields(mod, env, exp.fields)
      return X86.StructValue(exp.name, fields)
    }

    case "PointerExp": {
      const target = evaluate(mod, env, exp.target)
      return X86.PointerValue(target)
    }

    case "VarExp": {
      const value = X86.envLookup(env, exp.name)
      if (value) return value

      const definition = X86.modLookupDefinition(mod, exp.name)
      if (definition) {
        return definitionToValue(definition)
      }

      let message = `[evaluate] unknown name: ${exp.name}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    case "ApplyExp": {
      const target = evaluate(mod, env, exp.target)
      const args = exp.args.map((arg) => evaluate(mod, env, arg))
      return X86.apply(mod, env, target, args, exp.location)
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
  if (definition.kind === "StructDefinition") {
    const typeCtor = definition.typeConstructor
    if (typeCtor.parameters.length !== 0) {
      return X86.TypeConstructorValue(typeCtor)
    }
    return X86.TypeValue(X86.DataType(typeCtor, []))
  }

  if (definition.kind === "PrimitiveTypeDefinition") {
    const typeCtor = definition.typeConstructor
    if (typeCtor.parameters.length !== 0) {
      return X86.TypeConstructorValue(typeCtor)
    }
    return X86.TypeValue(X86.DataType(typeCtor, []))
  }

  let message = `[definitionToValue] unexpected definition kind: ${definition.kind}`
  throw new S.ErrorWithSourceLocation(message, definition.location)
}
