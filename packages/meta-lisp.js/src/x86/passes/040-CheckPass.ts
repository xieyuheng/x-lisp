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
    X86.check(mod, definition.value, claimedType)
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

    if (mod.codeMetadataType !== undefined) {
      X86.check(mod, meta.value, mod.codeMetadataType)
    }
  }
}
