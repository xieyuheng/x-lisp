import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function checkMod(mod: X86.Mod): void {
  checkDuplicateNames(mod)
  checkClaimedTypes(mod)
  checkMetadataTargets(mod)
  checkFieldTypes(mod)
}

function checkDuplicateNames(mod: X86.Mod): void {
  for (const name of mod.definitions.keys()) {
    if (
      Array.from(mod.definitions.keys()).filter((k) => k === name).length > 1
    ) {
      let message = `[check] duplicate definition: ${name}`
      throw new Error(message)
    }
  }
}

function checkClaimedTypes(mod: X86.Mod): void {
  for (const [name, def] of mod.definitions) {
    if (def.kind === "DataDefinition") {
      const claimedType = X86.modLookupClaimedType(mod, name)
      if (claimedType === undefined) {
        let message =
          `[check] define-data "${name}" is missing a corresponding claim`
        throw new S.ErrorWithSourceLocation(message, def.location)
      }
      checkStructFields(mod, def.fields, claimedType, def.location)
    }
  }
}

function checkMetadataTargets(mod: X86.Mod): void {
  for (const [target, meta] of mod.metadataDefinitions) {
    const targetDef = X86.modLookupDefinition(mod, target)
    if (targetDef === undefined || targetDef.kind !== "CodeDefinition") {
      let message =
        `[check] define-metadata target "${target}" is not a define-code`
      throw new S.ErrorWithSourceLocation(message, meta.location)
    }
  }
  if (mod.codeMetadataType !== undefined) {
    for (const [target, meta] of mod.metadataDefinitions) {
      checkStructFields(mod, meta.fields, mod.codeMetadataType, meta.location)
    }
  }
}

function checkFieldTypes(mod: X86.Mod): void {
  for (const [, def] of mod.definitions) {
    if (def.kind === "StructDefinition") {
      for (const [fieldName, fieldType] of def.fields) {
        if (fieldType.kind === "NamedType") {
          const structDef = X86.modLookupDefinition(mod, fieldType.name)
          if (
            structDef === undefined ||
            structDef.kind !== "StructDefinition"
          ) {
            let message =
              `[check] struct field type "${fieldType.name}" is not a defined struct`
            throw new S.ErrorWithSourceLocation(message, def.location)
          }
        }
      }
    }
  }
}

function checkStructFields(
  mod: X86.Mod,
  fields: Map<string, X86.Value>,
  type: X86.Type,
  location: S.SourceLocation,
): void {
  if (type.kind !== "NamedType") {
    let message = `[check] expected a named struct type, got: ${type.kind}`
    throw new S.ErrorWithSourceLocation(message, location)
  }
  const structDef = X86.modLookupDefinition(mod, type.name)
  if (structDef === undefined || structDef.kind !== "StructDefinition") {
    let message = `[check] unknown struct type: ${type.name}`
    throw new S.ErrorWithSourceLocation(message, location)
  }
  for (const [fieldName, fieldType] of structDef.fields) {
    const fieldValue = fields.get(fieldName)
    if (fieldValue === undefined) {
      let message =
        `[check] missing field "${fieldName}" for struct type "${type.name}"`
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
            let message =
              `[check] expected integer value for type ${type.name}, got: ${value.kind}`
            throw new S.ErrorWithSourceLocation(message, location)
          }
          return
        }
        case "string": {
          if (value.kind !== "StringValue") {
            let message =
              `[check] expected string value for type string, got: ${value.kind}`
            throw new S.ErrorWithSourceLocation(message, location)
          }
          return
        }
      }
      return
    }
    case "PointerType": {
      if (value.kind === "LabelValue") return
      if (value.kind === "PointerValue") {
        checkFieldValue(mod, value.target, type.target, location)
        return
      }
      let message =
        `[check] expected pointer or label value for pointer type, got: ${value.kind}`
      throw new S.ErrorWithSourceLocation(message, location)
    }
    case "NamedType": {
      if (value.kind !== "StructValue") {
        let message =
          `[check] expected struct value for type ${type.name}, got: ${value.kind}`
        throw new S.ErrorWithSourceLocation(message, location)
      }
      const innerDef = X86.modLookupDefinition(mod, type.name)
      if (innerDef === undefined || innerDef.kind !== "StructDefinition") {
        let message = `[check] unknown struct type in check: ${type.name}`
        throw new S.ErrorWithSourceLocation(message, location)
      }
      for (const [fieldName, fieldType] of innerDef.fields) {
        const fieldValue = value.fields.get(fieldName)
        if (fieldValue === undefined) {
          let message =
            `[check] missing field "${fieldName}" for struct type "${type.name}"`
          throw new S.ErrorWithSourceLocation(message, location)
        }
        checkFieldValue(mod, fieldValue, fieldType, location)
      }
      return
    }
  }
}
