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
  for (const [, definition] of mod.definitions) {
    if (definition.kind === "DataDefinition") {
      const claimedType = X86.modLookupClaimedType(mod, definition.name)
      if (claimedType === undefined) {
        let message = `[CheckPass] define-data "${definition.name}" is missing a corresponding claim`
        throw new S.ErrorWithSourceLocation(message, definition.location)
      }
      if (claimedType.kind !== "DataType") {
        let message = `[CheckPass] claim type for "${definition.name}" is not a struct type`
        throw new S.ErrorWithSourceLocation(message, definition.location)
      }
      const unfoldedFields = X86.dataTypeUnfold(
        mod,
        claimedType,
        definition.location,
      )
      for (const field of definition.fields) {
        const expectedType = unfoldedFields.get(field.name)
        if (expectedType === undefined) {
          let message = `[CheckPass] unexpected field "${field.name}" for type "${claimedType.typeConstructor.name}"`
          throw new S.ErrorWithSourceLocation(message, field.exp.location)
        }
        X86.check(mod, field.exp, expectedType)
      }
    }
  }
}

function checkMetadataTargets(mod: X86.Mod): void {
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
      if (mod.codeMetadataType.kind !== "DataType") {
        let message = `[CheckPass] code-metadata type is not a struct type`
        throw new S.ErrorWithSourceLocation(message, meta.location)
      }
      const unfoldedFields = X86.dataTypeUnfold(
        mod,
        mod.codeMetadataType,
        meta.location,
      )
      for (const field of meta.fields) {
        const expectedType = unfoldedFields.get(field.name)
        if (expectedType === undefined) {
          let message = `[CheckPass] unexpected metadata field "${field.name}"`
          throw new S.ErrorWithSourceLocation(message, field.exp.location)
        }
        X86.check(mod, field.exp, expectedType)
      }
    }
  }
}
