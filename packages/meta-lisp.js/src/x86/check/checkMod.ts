import * as S from "@xieyuheng/sexp.js"
import * as N from "../index.ts"

export function checkMod(mod: N.Mod): void {
  checkDuplicateNames(mod)
  checkDataTypes(mod)
  checkMetadataTargets(mod)
  checkFieldTypes(mod)
}

function checkDuplicateNames(mod: N.Mod): void {
  for (const name of mod.definitions.keys()) {
    if (
      Array.from(mod.definitions.keys()).filter((k) => k === name).length > 1
    ) {
      let message = `[check] duplicate definition: ${name}`
      throw new Error(message)
    }
  }
}

function checkDataTypes(mod: N.Mod): void {
  for (const [name, def] of mod.definitions) {
    if (def.kind === "DataDefinition") {
      const claimedType = N.modLookupDataType(mod, name)
      if (claimedType === undefined) {
        throw new S.ErrorWithSourceLocation(
          `[check] define-data "${name}" is missing a corresponding claim`,
          def.location,
        )
      }
      checkStructFields(mod, def.fields, claimedType, def.location)
    }
  }
}

function checkMetadataTargets(mod: N.Mod): void {
  for (const [target, meta] of mod.metadataOf) {
    const targetDef = N.modLookupDefinition(mod, target)
    if (targetDef === undefined || targetDef.kind !== "CodeDefinition") {
      throw new S.ErrorWithSourceLocation(
        `[check] define-metadata target "${target}" is not a define-code`,
        meta.location,
      )
    }
  }
  if (mod.codeMetadataType !== undefined) {
    for (const [target, meta] of mod.metadataOf) {
      checkStructFields(mod, meta.fields, mod.codeMetadataType, meta.location)
    }
  }
}

function checkFieldTypes(mod: N.Mod): void {
  for (const [, def] of mod.definitions) {
    if (def.kind === "StructDefinition") {
      for (const [fieldName, fieldType] of def.fields) {
        if (fieldType.kind === "NamedType") {
          const structDef = N.modLookupDefinition(mod, fieldType.name)
          if (
            structDef === undefined ||
            structDef.kind !== "StructDefinition"
          ) {
            throw new S.ErrorWithSourceLocation(
              `[check] struct field type "${fieldType.name}" is not a defined struct`,
              def.location,
            )
          }
        }
      }
    }
  }
}

function checkStructFields(
  mod: N.Mod,
  fields: Map<string, N.Value>,
  type: N.Type,
  location: S.SourceLocation,
): void {
  if (type.kind !== "NamedType") {
    throw new S.ErrorWithSourceLocation(
      `[check] expected a named struct type, got: ${type.kind}`,
      location,
    )
  }
  const structDef = N.modLookupDefinition(mod, type.name)
  if (structDef === undefined || structDef.kind !== "StructDefinition") {
    throw new S.ErrorWithSourceLocation(
      `[check] unknown struct type: ${type.name}`,
      location,
    )
  }
  for (const [fieldName, fieldType] of structDef.fields) {
    const fieldValue = fields.get(fieldName)
    if (fieldValue === undefined) {
      throw new S.ErrorWithSourceLocation(
        `[check] missing field "${fieldName}" for struct type "${type.name}"`,
        location,
      )
    }
    checkFieldValue(mod, fieldValue, fieldType, location)
  }
}

function checkFieldValue(
  mod: N.Mod,
  value: N.Value,
  type: N.Type,
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
            throw new S.ErrorWithSourceLocation(
              `[check] expected integer value for type ${type.name}, got: ${value.kind}`,
              location,
            )
          }
          return
        }
        case "string": {
          if (value.kind !== "StringValue") {
            throw new S.ErrorWithSourceLocation(
              `[check] expected string value for type string, got: ${value.kind}`,
              location,
            )
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
      throw new S.ErrorWithSourceLocation(
        `[check] expected pointer or label value for pointer type, got: ${value.kind}`,
        location,
      )
    }
    case "NamedType": {
      if (value.kind !== "StructValue") {
        throw new S.ErrorWithSourceLocation(
          `[check] expected struct value for type ${type.name}, got: ${value.kind}`,
          location,
        )
      }
      const innerDef = N.modLookupDefinition(mod, type.name)
      if (innerDef === undefined || innerDef.kind !== "StructDefinition") {
        throw new S.ErrorWithSourceLocation(
          `[check] unknown struct type in check: ${type.name}`,
          location,
        )
      }
      for (const [fieldName, fieldType] of innerDef.fields) {
        const fieldValue = value.fields.get(fieldName)
        if (fieldValue === undefined) {
          throw new S.ErrorWithSourceLocation(
            `[check] missing field "${fieldName}" for struct type "${type.name}"`,
            location,
          )
        }
        checkFieldValue(mod, fieldValue, fieldType, location)
      }
      return
    }
  }
}
