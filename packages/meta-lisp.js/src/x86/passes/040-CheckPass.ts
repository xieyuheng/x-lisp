import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function CheckPass(mod: X86.Mod): void {
  checkDuplicateNames(mod)
  checkDataFields(mod)
  checkMetadataTargets(mod)
}

function checkDuplicateNames(mod: X86.Mod): void {
  for (const [name, definition] of mod.definitions) {
    if (
      Array.from(mod.definitions.keys()).filter((k) => k === name).length > 1
    ) {
      let message = `[CheckPass] duplicate definition: ${name}`
      throw new S.ErrorWithSourceLocation(message, definition.location)
    }
  }
}

function checkDataFields(mod: X86.Mod): void {
  for (const [, definition] of mod.definitions) {
    if (definition.kind !== "DataDefinition") continue
    const claimedType = X86.modLookupClaimedType(mod, definition.name)
    if (claimedType === undefined) {
      let message = `[CheckPass] define-data "${definition.name}" is missing a corresponding claim`
      throw new S.ErrorWithSourceLocation(message, definition.location)
    }
    if (claimedType.kind !== "DataType") {
      let message = `[CheckPass] claim type for "${definition.name}" is not a struct type`
      throw new S.ErrorWithSourceLocation(message, definition.location)
    }
    const typeFields = X86.dataTypeUnfold(mod, claimedType, definition.location)
    X86.checkFields(mod, definition.fields, typeFields)
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
    if (mod.codeMetadataType.kind !== "DataType") {
      let message = `[CheckPass] code-metadata type is not a struct type`
      throw new S.ErrorWithSourceLocation(
        message,
        mod.codeMetadataTypeExp!.location,
      )
    }
    const typeFields = X86.dataTypeUnfold(
      mod,
      mod.codeMetadataType,
      S.zeroLocation("<code-metadata-type>"),
    )
    for (const [target, meta] of mod.metadataDefinitions) {
      X86.checkFields(mod, meta.fields, typeFields)
    }
  }
}
