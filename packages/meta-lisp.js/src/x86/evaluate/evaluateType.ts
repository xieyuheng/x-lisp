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
          throw new S.ErrorWithSourceLocation(
            `(pointer-t <type>) requires exactly one argument`,
            exp.location,
          )
        }
        const targetType = evaluateType(mod, exp.args[0])
        return X86.PointerType(targetType)
      }
      throw new S.ErrorWithSourceLocation(
        `[evaluateType] unknown type expression: ${exp.target.kind}`,
        exp.location,
      )
    }

    case "StringExp":
    case "IntExp":
    case "StructExp":
    case "PointerExp":
    case "LabelExp": {
      throw new S.ErrorWithSourceLocation(
        `[evaluateType] unexpected exp kind: ${exp.kind}`,
        exp.location,
      )
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

  throw new S.ErrorWithSourceLocation(
    `[evaluateType] unknown type name: ${name}`,
    location,
  )
}

function resolveAtomTypeName(name: string): string | undefined {
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
  for (const suffix of ["-t", ""]) {
    const base = suffix ? name.slice(0, -suffix.length) : name
    if (known.includes(base)) return base
  }
  return undefined
}
