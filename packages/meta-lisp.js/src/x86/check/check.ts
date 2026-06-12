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
        expectedType.kind !== "DataType" ||
        !isIntegerAtomTypeCtor(expectedType.typeConstructor.name)
      ) {
        let message = `[check] expected integer type for IntExp, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message, exp.location)
      }
      return
    }

    case "StringExp": {
      if (
        expectedType.kind !== "DataType" ||
        expectedType.typeConstructor.name !== "string-t"
      ) {
        let message = `[check] expected string-t for StringExp, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message, exp.location)
      }
      return
    }

    case "LabelExp": {
      if (
        expectedType.kind !== "DataType" ||
        expectedType.typeConstructor.name !== "pointer-t"
      ) {
        let message = `[check] expected pointer-t for LabelExp, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message, exp.location)
      }
      return
    }

    case "PointerExp": {
      if (
        expectedType.kind !== "DataType" ||
        expectedType.typeConstructor.name !== "pointer-t"
      ) {
        let message = `[check] expected pointer-t for PointerExp, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message, exp.location)
      }
      check(mod, exp.target, expectedType.argTypes[0])
      return
    }

    case "StructExp": {
      if (expectedType.kind !== "DataType") {
        let message = `[check] expected struct type for StructExp, got: ${X86.formatType(expectedType)}`
        throw new S.ErrorWithSourceLocation(message, exp.location)
      }
      const typeCtorName = expectedType.typeConstructor.name
      const unfoldedFields = dataTypeUnfold(mod, expectedType, exp.location)
      for (const field of exp.fields) {
        const expectedFieldType = unfoldedFields.get(field.name)
        if (expectedFieldType === undefined) {
          let message = `[check] unknown field "${field.name}" for struct type "${typeCtorName}"`
          throw new S.ErrorWithSourceLocation(message, field.exp.location)
        }
        check(mod, field.exp, expectedFieldType)
      }
      return
    }

    default: {
      let message = `[check] unexpected expression kind in data: ${exp.kind}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
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
