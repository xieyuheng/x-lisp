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

  // Validate: claimed type is a DataType
  for (const [name, type] of mod.claimedTypes) {
    if (type.kind !== "DataType") {
      let message = `[ClaimPass] claimed type for "${name}" must be a struct type, got: ${type.kind}`
      throw new S.ErrorWithSourceLocation(
        message,
        mod.claimedTypeExps.get(name)!.location,
      )
    }
  }

  // Validate: codeMetadataType is a known struct
  if (mod.codeMetadataType) {
    if (mod.codeMetadataType.kind !== "DataType") {
      let message = `[ClaimPass] code-metadata type must be a struct type, got: ${mod.codeMetadataType.kind}`
      throw new S.ErrorWithSourceLocation(
        message,
        mod.codeMetadataTypeExp!.location,
      )
    }
    const structDefinition = X86.modLookupDefinition(
      mod,
      mod.codeMetadataType.typeConstructor.name,
    )
    if (
      structDefinition === undefined ||
      structDefinition.kind !== "StructDefinition"
    ) {
      let message = `[ClaimPass] code-metadata type "${mod.codeMetadataType.typeConstructor.name}" is not a defined struct`
      throw new S.ErrorWithSourceLocation(
        message,
        mod.codeMetadataTypeExp!.location,
      )
    }
  }
}
