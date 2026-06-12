import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function checkStructFields(
  mod: X86.Mod,
  fields: Map<string, X86.Value>,
  type: X86.Type,
  location: S.SourceLocation,
): void {
  if (type.kind !== "DataType") {
    let message = `[checkStructFields] expected a struct type, got: ${type.kind}`
    throw new S.ErrorWithSourceLocation(message, location)
  }
  const name = type.typeConstructor.name
  const unfoldedFields = dataTypeUnfold(mod, type, location)
  for (const [fieldName, fieldType] of unfoldedFields) {
    const fieldValue = fields.get(fieldName)
    if (fieldValue === undefined) {
      let message = `[checkStructFields] missing field "${fieldName}" for struct type "${name}"`
      throw new S.ErrorWithSourceLocation(message, location)
    }
    checkFieldValue(mod, fieldValue, fieldType, location)
  }
}

export function checkFieldValue(
  mod: X86.Mod,
  value: X86.Value,
  type: X86.Type,
  location: S.SourceLocation,
): void {
  switch (type.kind) {
    case "AtomType": {
      switch (type.name) {
        case "int8":
        case "int16":
        case "int32":
        case "int64":
        case "uint8":
        case "uint16":
        case "uint32":
        case "uint64": {
          if (value.kind !== "IntValue") {
            let message = `[checkFieldValue] expected integer value for type ${type.name}, got: ${value.kind}`
            throw new S.ErrorWithSourceLocation(message, location)
          }
          return
        }
        case "string": {
          if (value.kind !== "StringValue") {
            let message = `[checkFieldValue] expected string value for type string, got: ${value.kind}`
            throw new S.ErrorWithSourceLocation(message, location)
          }
          return
        }
      }
      return
    }
    case "DataType": {
      const typeConstructorName = type.typeConstructor.name
      if (typeConstructorName === "pointer-t") {
        if (value.kind === "LabelValue") return
        if (value.kind === "PointerValue") {
          checkFieldValue(mod, value.target, type.argTypes[0], location)
          return
        }
        let message = `[checkFieldValue] expected pointer or label value for pointer type, got: ${value.kind}`
        throw new S.ErrorWithSourceLocation(message, location)
      }
      if (isIntegerAtomTypeCtor(typeConstructorName)) {
        if (value.kind !== "IntValue") {
          let message = `[checkFieldValue] expected integer value for type ${typeConstructorName}, got: ${value.kind}`
          throw new S.ErrorWithSourceLocation(message, location)
        }
        return
      }
      if (typeConstructorName === "string-t") {
        if (value.kind !== "StringValue") {
          let message = `[checkFieldValue] expected string value for type string-t, got: ${value.kind}`
          throw new S.ErrorWithSourceLocation(message, location)
        }
        return
      }
      if (value.kind !== "StructValue") {
        let message = `[checkFieldValue] expected struct value for type ${typeConstructorName}, got: ${value.kind}`
        throw new S.ErrorWithSourceLocation(message, location)
      }
      const unfoldedFields = dataTypeUnfold(mod, type, location)
      for (const [fieldName, fieldType] of unfoldedFields) {
        const fieldValue = value.fields.get(fieldName)
        if (fieldValue === undefined) {
          let message = `[checkFieldValue] missing field "${fieldName}" for struct type "${typeConstructorName}"`
          throw new S.ErrorWithSourceLocation(message, location)
        }
        checkFieldValue(mod, fieldValue, fieldType, location)
      }
      return
    }
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
