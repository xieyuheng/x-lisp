import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function check(
  program: X86.Program,
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
        throw new Error(message)
      }
      return
    }

    case "StringData": {
      if (
        expectedType.kind !== "NamedType" ||
        expectedType.name !== "string-t"
      ) {
        let message = `[check] expected string-t for StringData, got: ${X86.formatType(expectedType)}`
        throw new Error(message)
      }
      return
    }

    case "AddressData": {
      if (
        expectedType.kind !== "NamedType" ||
        expectedType.name !== "pointer-t"
      ) {
        let message = `[check] expected pointer-t for AddressData, got: ${X86.formatType(expectedType)}`
        throw new Error(message)
      }
      const def = X86.programLookupDefinition(program, data.name)
      if (def === undefined) {
        let message = `[check] unknown name: ${data.name}`
        throw new Error(message)
      }
      if (
        def.kind === "StructDefinition" ||
        def.kind === "PrimitiveTypeDefinition"
      ) {
        let message = `[check] type name cannot be used as data address: ${data.name}`
        throw new Error(message)
      }
      return
    }

    case "PointerData": {
      if (
        expectedType.kind !== "NamedType" ||
        expectedType.name !== "pointer-t"
      ) {
        let message = `[check] expected pointer-t for PointerData, got: ${X86.formatType(expectedType)}`
        throw new Error(message)
      }
      checkPointerTarget(program, data.target)
      return
    }

    case "StructData": {
      if (expectedType.kind !== "NamedType") {
        let message = `[check] expected struct type for StructData, got: ${X86.formatType(expectedType)}`
        throw new Error(message)
      }
      const typeFields = dataTypeUnfold(
        program,
        expectedType,
        S.zeroLocation("check"),
      )

      checkFields(program, data.fields, typeFields)
      return
    }

    case "ArrayData": {
      if (expectedType.kind !== "ArrayType") {
        let message = `[check] expected array type for ArrayData, got: ${X86.formatType(expectedType)}`
        throw new Error(message)
      }
      if (data.elements.length !== expectedType.length) {
        let message = `[check] array length mismatch: expected ${expectedType.length}, got ${data.elements.length}`
        throw new Error(message)
      }
      for (const elem of data.elements) {
        check(program, elem, expectedType.element)
      }
      return
    }

    default: {
      throw new Error(`[check] unexpected expression kind in data`)
    }
  }
}

export function checkFields(
  program: X86.Program,
  fields: Record<string, X86.Data>,
  typeFields: Map<string, X86.Type>,
): void {
  const fieldEntries = Object.entries(fields)
  if (fieldEntries.length !== typeFields.size) {
    let message = `[checkFields] field count mismatch: expected ${typeFields.size}, got ${fieldEntries.length}`
    throw new Error(message)
  }

  for (const [expectedName, expectedType] of typeFields) {
    const fieldExp = fields[expectedName]
    if (fieldExp === undefined) {
      let message = `[checkFields] missing field: "${expectedName}"`
      throw new Error(message)
    }
    check(program, fieldExp, expectedType)
  }
}

export function dataTypeUnfold(
  program: X86.Program,
  dataType: X86.Type,
  location: S.SourceLocation,
): Map<string, X86.Type> {
  if (dataType.kind !== "NamedType") {
    let message = `[dataTypeUnfold] expected named type for struct unfolding`
    throw new Error(message)
  }
  const structDefinition = lookupStructDefinition(
    program,
    dataType.name,
    S.zeroLocation("dataTypeUnfold"),
  )

  const result = new Map<string, X86.Type>()
  for (const fieldName of Object.keys(structDefinition.fields)) {
    result.set(fieldName, structDefinition.fields[fieldName])
  }
  return result
}

export function lookupStructDefinition(
  program: X86.Program,
  name: string,
  location: S.SourceLocation,
): X86.StructDefinition {
  const definition = X86.programLookupDefinition(program, name)
  if (definition === undefined || definition.kind !== "StructDefinition") {
    let message = `[lookupStructDefinition] unknown struct type: ${name}`
    throw new Error(message)
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

function checkPointerTarget(program: X86.Program, target: X86.Data): void {
  if (target.kind === "StructData") {
    check(
      program,
      target,
      namedDataType(program, target.name, S.zeroLocation("checkPointerTarget")),
    )

    return
  }

  if (target.kind === "StringData") {
    check(
      program,
      target,
      namedDataType(program, "string-t", S.zeroLocation("checkPointerTarget")),
    )

    return
  }

  let message = `[check] pointer target must be (struct <name> ...) or a string literal, got: ${target.kind}`
  throw new Error(message)
}

function namedDataType(
  program: X86.Program,
  name: string,
  location: S.SourceLocation,
): X86.Type {
  const definition = X86.programLookupDefinition(program, name)
  if (
    definition === undefined ||
    (definition.kind !== "StructDefinition" &&
      definition.kind !== "PrimitiveTypeDefinition")
  ) {
    let message = `[check] unknown type: ${name}`
    throw new Error(message)
  }
  return X86.NamedType(definition.name)
}

export function inferDataType(program: X86.Program, value: X86.Data): X86.Type {
  switch (value.kind) {
    case "StructData": {
      return namedDataType(program, value.name, S.zeroLocation("inferDataType"))
    }
    case "PointerData":
    case "AddressData":
      return namedDataType(
        program,
        "pointer-t",
        S.zeroLocation("inferDataType"),
      )

    case "StringData":
      return namedDataType(program, "string-t", S.zeroLocation("inferDataType"))

    default: {
      let message = `[inferDataType] define-data value must be self-describing (named struct, pointer, address, or string), got: ${value.kind}`
      throw new Error(message)
    }
  }
}
