import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function evaluateType(mod: X86.Mod, exp: X86.Exp): X86.Type {
  switch (exp.kind) {
    case "VarExp": {
      return evaluateVarType(mod, exp.name, exp.location)
    }

    case "ApplyExp": {
      if (exp.target.kind === "VarExp" && exp.target.name === "pointer-t") {
        if (exp.args.length !== 1) {
          let message = `(pointer-t <type>) requires exactly one argument`
          throw new S.ErrorWithSourceLocation(message, exp.location)
        }
        const targetType = evaluateType(mod, exp.args[0])
        return X86.PointerType(targetType)
      }
      let message = `[evaluateType] unknown type expression: ${exp.target.kind}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    case "StringExp":
    case "IntExp":
    case "StructExp":
    case "PointerExp":
    case "LabelExp": {
      let message = `[evaluateType] unexpected exp kind: ${exp.kind}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }
  }
}

function evaluateVarType(
  mod: X86.Mod,
  name: string,
  location: S.SourceLocation,
): X86.Type {
  const atomName = resolveAtomTypeName(name)
  if (atomName) return X86.AtomType(atomName)

  const definition = X86.modLookupDefinition(mod, name)
  if (definition && definition.kind === "StructDefinition") {
    return X86.NamedType(mod, name)
  }

  const claimedType = X86.modLookupClaimedType(mod, name)
  if (claimedType) return claimedType

  let message = `[evaluateType] unknown type name: ${name}`
  throw new S.ErrorWithSourceLocation(message, location)
}

export function evaluateTypeFields(
  mod: X86.Mod,
  fields: Array<X86.StructField>,
): Map<string, X86.Type> {
  const result = new Map<string, X86.Type>()
  for (const field of fields) {
    result.set(field.name, evaluateType(mod, field.exp))
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
