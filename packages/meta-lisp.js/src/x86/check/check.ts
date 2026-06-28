import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function check(
  mod: X86.Mod,
  exp: X86.Exp,
  expectedType: X86.Type,
): void {
  switch (exp.kind) {
    case "IntExp": {
      if (
        expectedType.kind !== "NamedType" ||
        !isIntegerAtomTypeCtor(expectedType.name)
      ) {
        let message = `[check] expected integer type for IntExp, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message, exp.location)
      }
      return
    }

    case "StringExp": {
      if (
        expectedType.kind !== "NamedType" ||
        expectedType.name !== "string-t"
      ) {
        let message = `[check] expected string-t for StringExp, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message, exp.location)
      }
      return
    }

    case "AddressExp": {
      if (
        expectedType.kind !== "NamedType" ||
        expectedType.name !== "pointer-t"
      ) {
        let message = `[check] expected pointer-t for AddressExp, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message, exp.location)
      }
      return
    }

    case "PointerExp": {
      if (
        expectedType.kind !== "NamedType" ||
        expectedType.name !== "pointer-t"
      ) {
        let message = `[check] expected pointer-t for PointerExp, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message, exp.location)
      }
      checkPointerTarget(mod, exp.target)
      return
    }

    case "StructExp": {
      if (expectedType.kind !== "NamedType") {
        let message = `[check] expected struct type for StructExp, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message, exp.location)
      }
      const typeFields = dataTypeUnfold(mod, expectedType, exp.location)
      checkFields(mod, exp.fields, typeFields)
      return
    }

    case "ArrayExp": {
      if (expectedType.kind !== "ArrayType") {
        let message = `[check] expected array type for ArrayExp, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message, exp.location)
      }
      if (exp.elements.length !== expectedType.length) {
        let message = `[check] array length mismatch: expected ${expectedType.length}, got ${exp.elements.length}`
        throw new S.ErrorWithSourceLocation(message, exp.location)
      }
      for (const elem of exp.elements) {
        check(mod, elem, expectedType.element)
      }
      return
    }

    default: {
      let message = `[check] unexpected expression kind in data: ${exp.kind}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }
  }
}

export function checkFields(
  mod: X86.Mod,
  structFields: Array<X86.StructField>,
  typeFields: Map<string, X86.Type>,
): void {
  if (structFields.length !== typeFields.size) {
    let message = `[checkFields] field count mismatch: expected ${typeFields.size}, got ${structFields.length}`
    throw new S.ErrorWithSourceLocation(
      message,
      structFields.length > 0
        ? structFields.length > typeFields.size
          ? structFields[typeFields.size].exp.location
          : structFields[structFields.length - 1].exp.location
        : S.zeroLocation("<checkFields>"),
    )
  }

  let i = 0
  for (const [expectedName, expectedType] of typeFields) {
    const field = structFields[i]
    if (field.name !== expectedName) {
      let message = `[checkFields] field name mismatch at position ${i}: expected "${expectedName}", got "${field.name}"`
      throw new S.ErrorWithSourceLocation(message, field.exp.location)
    }
    check(mod, field.exp, expectedType)
    i++
  }
}

export function dataTypeUnfold(
  mod: X86.Mod,
  dataType: X86.Type,
  location: S.SourceLocation,
): Map<string, X86.Type> {
  if (dataType.kind !== "NamedType") {
    let message = `[dataTypeUnfold] expected named type for struct unfolding`
    throw new S.ErrorWithSourceLocation(message, location)
  }
  const structDefinition = lookupStructDefinition(mod, dataType.name, location)
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

function checkPointerTarget(mod: X86.Mod, target: X86.Exp): void {
  if (target.kind === "StructExp") {
    if (target.name === undefined) {
      let message = `[check] pointer target struct must be named (opaque pointer requires an explicit struct type)`
      throw new S.ErrorWithSourceLocation(message, target.location)
    }
    check(mod, target, namedDataType(mod, target.name, target.location))
    return
  }

  if (target.kind === "StringExp") {
    check(mod, target, namedDataType(mod, "string-t", target.location))
    return
  }

  let message = `[check] pointer target must be (@struct <name> ...) or a string literal, got: ${target.kind}`
  throw new S.ErrorWithSourceLocation(message, target.location)
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
    throw new S.ErrorWithSourceLocation(message, location)
  }
  return X86.NamedType(definition.name)
}

export function inferDataType(mod: X86.Mod, value: X86.Exp): X86.Type {
  switch (value.kind) {
    case "StructExp": {
      if (value.name === undefined) {
        let message = `[inferDataType] struct literal must be named (define-data value must be self-describing)`
        throw new S.ErrorWithSourceLocation(message, value.location)
      }
      return namedDataType(mod, value.name, value.location)
    }
    case "PointerExp":
    case "AddressExp":
      return namedDataType(mod, "pointer-t", value.location)
    case "StringExp":
      return namedDataType(mod, "string-t", value.location)
    default: {
      let message = `[inferDataType] define-data value must be self-describing (named struct, pointer, address, or string), got: ${value.kind}`
      throw new S.ErrorWithSourceLocation(message, value.location)
    }
  }
}
