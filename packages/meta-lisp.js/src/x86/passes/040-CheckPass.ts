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
      throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
    }
  }
}

function checkDataFields(mod: X86.Mod): void {
  for (const [, definition] of mod.definitions) {
    if (definition.kind !== "DataDefinition") continue
    X86.check(mod, definition.value, X86.inferDataType(mod, definition.value))
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
      throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
    }

    X86.check(mod, meta.value, X86.inferDataType(mod, meta.value))
  }
}
