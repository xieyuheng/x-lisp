import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function ClaimPass(mod: X86.Mod): void {
  // Evaluate and populate claimedTypes
  for (const [name, exp] of mod.claimedTypeExps) {
    const env = X86.emptyEnv()
    const type = X86.evaluateType(mod, env, exp)
    mod.claimedTypes.set(name, type)
  }

  // Evaluate and populate codeMetadataType
  if (mod.codeMetadataTypeExp) {
    const env = X86.emptyEnv()
    const type = X86.evaluateType(mod, env, mod.codeMetadataTypeExp)
    mod.codeMetadataType = type
  }

  // Validate: each claimed name has a corresponding DataDefinition
  for (const name of mod.claimedTypes.keys()) {
    const definition = X86.modLookupDefinition(mod, name)
    if (definition === undefined || definition.kind !== "DataDefinition") {
      let message = `[ClaimPass] claimed name "${name}" has no corresponding define-data`
      throw new S.ErrorWithSourceLocation(
        message,
        mod.claimedTypeExps.get(name)!.location,
      )
    }
  }

  // Validate: code-metadata type occupies exactly the 8-byte -8 slot
  if (mod.codeMetadataType) {
    const size = X86.typeSize(mod.codeMetadataType)
    if (size !== 8) {
      let message = `[ClaimPass] code-metadata type must have size 8 (the -8 slot holds a pointer), got size ${size}`
      throw new S.ErrorWithSourceLocation(
        message,
        mod.codeMetadataTypeExp!.location,
      )
    }
  }
}
