import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function check(mod: X86.Mod, exp: X86.Exp, expectedType: X86.Type): void {
  if (expectedType.kind !== "DataType") {
    let message = `[check] expected a DataType, got: ${expectedType.kind}`
    throw new S.ErrorWithSourceLocation(message, exp.location)
  }
  const typeCtorName = expectedType.typeConstructor.name

  if (isIntegerAtomTypeCtor(typeCtorName)) {
    if (exp.kind !== "IntExp") {
      let message = `[check] expected integer for type ${typeCtorName}, got: ${exp.kind}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }
    return
  }

  if (typeCtorName === "string-t") {
    if (exp.kind !== "StringExp") {
      let message = `[check] expected string for type string-t, got: ${exp.kind}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }
    return
  }

  if (typeCtorName === "pointer-t") {
    if (exp.kind === "LabelExp") return
    if (exp.kind === "PointerExp") {
      check(mod, exp.target, expectedType.argTypes[0])
      return
    }
    let message = `[check] expected pointer or label for type pointer-t, got: ${exp.kind}`
    throw new S.ErrorWithSourceLocation(message, exp.location)
  }

  if (exp.kind !== "StructExp") {
    let message = `[check] expected struct for type ${typeCtorName}, got: ${exp.kind}`
    throw new S.ErrorWithSourceLocation(message, exp.location)
  }

  const unfoldedFields = dataTypeUnfold(mod, expectedType, exp.location)
  for (const field of exp.fields) {
    const expectedFieldType = unfoldedFields.get(field.name)
    if (expectedFieldType === undefined) {
      let message = `[check] unknown field "${field.name}" for struct type "${typeCtorName}"`
      throw new S.ErrorWithSourceLocation(message, field.exp.location)
    }
    check(mod, field.exp, expectedFieldType)
  }
}

export function dataTypeUnfold(
  mod: X86.Mod,
  dataType: X86.DataType,
  location: S.SourceLocation,
): Map<string, X86.Type> {
  const structDefinition = lookupStructDefinition(
    mod,
    dataType.typeConstructor.name,
    location,
  )
  const env = X86.envPutMany(
    X86.emptyEnv(),
    dataType.typeConstructor.parameters,
    dataType.argTypes.map((t) => X86.TypeValue(t)),
  )
  const result = new Map<string, X86.Type>()
  for (const field of structDefinition.fields) {
    result.set(field.name, X86.evaluateType(mod, env, field.exp))
  }
  return result
}

export function lookupStructDefinition(
  mod: X86.Mod,
  name: string,
  location: S.SourceLocation,
): X86.StructDefinition {
  const definition = X86.modLookupDefinition(mod, name)
  if (definition === undefined || definition.kind !== "StructDefinition") {
    let message = `[lookupStructDefinition] unknown struct type: ${name}`
    throw new S.ErrorWithSourceLocation(message, location)
  }
  return definition
}

export function isIntegerAtomTypeCtor(name: string): boolean {
  return (
    name === "int8-t" ||
    name === "int16-t" ||
    name === "int32-t" ||
    name === "int64-t" ||
    name === "uint8-t" ||
    name === "uint16-t" ||
    name === "uint32-t" ||
    name === "uint64-t"
  )
}
