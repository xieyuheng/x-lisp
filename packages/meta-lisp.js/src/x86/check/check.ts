import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function check(
  mod: X86.Mod,
  data: X86.Data,
  expectedType: X86.Type,
): void {
  switch (data.kind) {
    case "IntData": {
      if (
        expectedType.kind !== "NamedType" ||
        !isIntegerAtomTypeCtor(expectedType.name)
      ) {
        let message = `[check] expected integer type for IntData, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
      }
      return
    }

    case "StringData": {
      if (
        expectedType.kind !== "NamedType" ||
        expectedType.name !== "string-t"
      ) {
        let message = `[check] expected string-t for StringData, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
      }
      return
    }

    case "AddressData": {
      if (
        expectedType.kind !== "NamedType" ||
        expectedType.name !== "pointer-t"
      ) {
        let message = `[check] expected pointer-t for AddressData, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
      }
      const def = X86.modLookupDefinition(mod, data.name)
      if (def === undefined) {
        let message = `[check] unknown name: ${data.name}`
        throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
      }
      if (
        def.kind === "StructDefinition" ||
        def.kind === "PrimitiveTypeDefinition"
      ) {
        let message = `[check] type name cannot be used as data address: ${data.name}`
        throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
      }
      return
    }

    case "PointerData": {
      if (
        expectedType.kind !== "NamedType" ||
        expectedType.name !== "pointer-t"
      ) {
        let message = `[check] expected pointer-t for PointerData, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
      }
      checkPointerTarget(mod, data.target)
      return
    }

    case "StructData": {
      if (expectedType.kind !== "NamedType") {
        let message = `[check] expected struct type for StructData, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
      }
      const typeFields = dataTypeUnfold(mod, expectedType, S.zeroLocation("check"))

      checkFields(mod, data.fields, typeFields)
      return
    }

    case "ArrayData": {
      if (expectedType.kind !== "ArrayType") {
        let message = `[check] expected array type for ArrayData, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
      }
      if (data.elements.length !== expectedType.length) {
        let message = `[check] array length mismatch: expected ${expectedType.length}, got ${data.elements.length}`
        throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
      }
      for (const elem of data.elements) {
        check(mod, elem, expectedType.element)
      }
      return
    }

    default: {
      throw new S.ErrorWithSourceLocation(
        `[check] unexpected expression kind in data`,
        S.zeroLocation("check"),
      )
    }
  }
}

export function checkFields(
  mod: X86.Mod,
  fields: Record<string, X86.Data>,
  typeFields: Map<string, X86.Type>,
): void {
  const fieldEntries = Object.entries(fields)
  if (fieldEntries.length !== typeFields.size) {
    let message = `[checkFields] field count mismatch: expected ${typeFields.size}, got ${fieldEntries.length}`
    throw new S.ErrorWithSourceLocation(
      message,
      S.zeroLocation("<checkFields>"),
    )
  }

  for (const [expectedName, expectedType] of typeFields) {
    const fieldExp = fields[expectedName]
    if (fieldExp === undefined) {
      let message = `[checkFields] missing field: "${expectedName}"`
      throw new S.ErrorWithSourceLocation(
        message,
        S.zeroLocation("<checkFields>"),
      )
    }
    check(mod, fieldExp, expectedType)
  }
}

export function dataTypeUnfold(
  mod: X86.Mod,
  dataType: X86.Type,
  location: S.SourceLocation,
): Map<string, X86.Type> {
  if (dataType.kind !== "NamedType") {
    let message = `[dataTypeUnfold] expected named type for struct unfolding`
    throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
  }
  const structDefinition = lookupStructDefinition(mod, dataType.name, S.zeroLocation("dataTypeUnfold"))

  const result = new Map<string, X86.Type>()
  for (const fieldName of Object.keys(structDefinition.fields)) {
    result.set(fieldName, structDefinition.fields[fieldName])
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
    throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
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

function checkPointerTarget(mod: X86.Mod, target: X86.Data): void {
  if (target.kind === "StructData") {
    check(mod, target, namedDataType(mod, target.name, S.zeroLocation("checkPointerTarget")))

    return
  }

  if (target.kind === "StringData") {
    check(mod, target, namedDataType(mod, "string-t", S.zeroLocation("checkPointerTarget")))

    return
  }

  let message = `[check] pointer target must be (struct <name> ...) or a string literal, got: ${target.kind}`
  throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
}

function namedDataType(
  mod: X86.Mod,
  name: string,
  location: S.SourceLocation,
): X86.Type {
  const definition = X86.modLookupDefinition(mod, name)
  if (
    definition === undefined ||
    (definition.kind !== "StructDefinition" &&
      definition.kind !== "PrimitiveTypeDefinition")
  ) {
    let message = `[check] unknown type: ${name}`
    throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
  }
  return X86.NamedType(definition.name)
}

export function inferDataType(mod: X86.Mod, value: X86.Data): X86.Type {
  switch (value.kind) {
    case "StructData": {
      return namedDataType(mod, value.name, S.zeroLocation("inferDataType"))

    }
    case "PointerData":
    case "AddressData":
      return namedDataType(mod, "pointer-t", S.zeroLocation("inferDataType"))

    case "StringData":
      return namedDataType(mod, "string-t", S.zeroLocation("inferDataType"))

    default: {
      let message = `[inferDataType] define-data value must be self-describing (named struct, pointer, address, or string), got: ${value.kind}`
      throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
    }
  }
}
