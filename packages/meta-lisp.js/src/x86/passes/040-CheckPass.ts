import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function CheckPass(mod: X86.Mod): void {
  checkDuplicateNames(mod)
  checkDataFields(mod)
  checkMetadataTargets(mod)
}

function checkDuplicateNames(mod: X86.Mod): void {
  for (const name of mod.definitions.keys()) {
    if (
      Array.from(mod.definitions.keys()).filter((k) => k === name).length > 1
    ) {
      let message = `[CheckPass] duplicate definition: ${name}`
      throw new Error(message)
    }
  }
}

function checkDataFields(mod: X86.Mod): void {
  const env = X86.emptyEnv()

  for (const [, definition] of mod.definitions) {
    if (definition.kind === "DataDefinition") {
      const claimedType = X86.modLookupClaimedType(mod, definition.name)
      if (claimedType === undefined) {
        let message = `[CheckPass] define-data "${definition.name}" is missing a corresponding claim`
        throw new S.ErrorWithSourceLocation(message, definition.location)
      }
      const evaluatedFields = X86.evaluateFields(mod, env, definition.fields)
      checkStructFields(mod, evaluatedFields, claimedType, definition.location)
    }
  }
}

function checkMetadataTargets(mod: X86.Mod): void {
  const env = X86.emptyEnv()

  for (const [target, meta] of mod.metadataDefinitions) {
    const targetDefinition = X86.modLookupDefinition(mod, target)
    if (
      targetDefinition === undefined ||
      targetDefinition.kind !== "CodeDefinition"
    ) {
      let message = `[CheckPass] define-metadata target "${target}" is not a define-code`
      throw new S.ErrorWithSourceLocation(message, meta.location)
    }
  }

  if (mod.codeMetadataType !== undefined) {
    for (const [target, meta] of mod.metadataDefinitions) {
      const evaluatedFields = X86.evaluateFields(mod, env, meta.fields)
      checkStructFields(
        mod,
        evaluatedFields,
        mod.codeMetadataType,
        meta.location,
      )
    }
  }
}

function checkStructFields(
  mod: X86.Mod,
  fields: Map<string, X86.Value>,
  type: X86.Type,
  location: S.SourceLocation,
): void {
  if (type.kind !== "DataType") {
    let message = `[CheckPass] expected a struct type, got: ${type.kind}`
    throw new S.ErrorWithSourceLocation(message, location)
  }
  const name = type.typeConstructor.name
  const unfoldedFields = dataTypeUnfold(mod, type, location)
  for (const [fieldName, fieldType] of unfoldedFields) {
    const fieldValue = fields.get(fieldName)
    if (fieldValue === undefined) {
      let message = `[CheckPass] missing field "${fieldName}" for struct type "${name}"`
      throw new S.ErrorWithSourceLocation(message, location)
    }
    checkFieldValue(mod, fieldValue, fieldType, location)
  }
}

function checkFieldValue(
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
            let message = `[CheckPass] expected integer value for type ${type.name}, got: ${value.kind}`
            throw new S.ErrorWithSourceLocation(message, location)
          }
          return
        }
        case "string": {
          if (value.kind !== "StringValue") {
            let message = `[CheckPass] expected string value for type string, got: ${value.kind}`
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
        let message = `[CheckPass] expected pointer or label value for pointer type, got: ${value.kind}`
        throw new S.ErrorWithSourceLocation(message, location)
      }
      if (value.kind !== "StructValue") {
        let message = `[CheckPass] expected struct value for type ${typeConstructorName}, got: ${value.kind}`
        throw new S.ErrorWithSourceLocation(message, location)
      }
      const unfoldedFields = dataTypeUnfold(mod, type, location)
      for (const [fieldName, fieldType] of unfoldedFields) {
        const fieldValue = value.fields.get(fieldName)
        if (fieldValue === undefined) {
          let message = `[CheckPass] missing field "${fieldName}" for struct type "${typeConstructorName}"`
          throw new S.ErrorWithSourceLocation(message, location)
        }
        checkFieldValue(mod, fieldValue, fieldType, location)
      }
      return
    }
  }
}

function dataTypeUnfold(
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

function lookupStructDefinition(
  mod: X86.Mod,
  name: string,
  location: S.SourceLocation,
): X86.StructDefinition {
  const definition = X86.modLookupDefinition(mod, name)
  if (definition === undefined || definition.kind !== "StructDefinition") {
    let message = `[CheckPass] unknown struct type: ${name}`
    throw new S.ErrorWithSourceLocation(message, location)
  }
  return definition
}
