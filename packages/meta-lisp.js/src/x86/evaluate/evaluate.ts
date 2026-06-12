import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function evaluate(mod: X86.Mod, env: X86.Env, exp: X86.Exp): X86.Value {
  switch (exp.kind) {
    case "IntExp":
      return X86.IntValue(exp.value)

    case "StringExp":
      return X86.StringValue(exp.content)

    case "LabelExp":
      return X86.LabelValue(exp.name, exp.path)

    case "StructExp": {
      const fields = evaluateFields(mod, env, exp.fields)
      return X86.StructValue(exp.name, fields)
    }

    case "PointerExp": {
      const target = evaluate(mod, env, exp.target)
      return X86.PointerValue(target)
    }

    case "VarExp": {
      return evaluateVar(mod, env, exp.name, exp.location)
    }

    case "ApplyExp": {
      const target = evaluate(mod, env, exp.target)
      const args = exp.args.map((arg) => evaluate(mod, env, arg))
      return X86.apply(mod, env, target, args, exp.location)
    }
  }
}

function evaluateVar(
  mod: X86.Mod,
  env: X86.Env,
  name: string,
  location: S.SourceLocation,
): X86.Value {
  const binding = X86.envLookup(env, name)
  if (binding) return binding

  const atomName = resolveAtomTypeName(name)
  if (atomName) return X86.TypeValue(X86.AtomType(atomName))

  const typeCtor = mod.typeConstructors.get(name)
  if (typeCtor) {
    if (typeCtor.parameters.length !== 0) {
      return X86.TypeConstructorValue(typeCtor)
    }
    return X86.TypeValue(X86.DataType(typeCtor, []))
  }

  let message = `[evaluate] unknown name: ${name}`
  throw new S.ErrorWithSourceLocation(message, location)
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

function resolveAtomTypeName(name: string): string | undefined {
  if (!name.endsWith("-t")) return undefined
  const base = name.slice(0, -2)
  const known = [
    "int8",
    "int16",
    "int32",
    "int64",
    "uint8",
    "uint16",
    "uint32",
    "uint64",
    "string",
  ]
  if (known.includes(base)) return base
  return undefined
}
