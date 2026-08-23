import * as S from "@xieyuheng/sexp.js"
import { lookupStructDefinition } from "../check/check.ts"
import type { EncodedInstruction } from "../encode/index.ts"
import { formatType } from "../format/formatType.ts"
import type { Mod } from "../mod/index.ts"
import { typeSize } from "../type/typeSize.ts"

export function offsetOf(
  mod: Mod,
  structTypeName: string,
  fields: Array<string>,
): number {
  let currentTypeName = structTypeName
  let totalOffset = 0

  for (const step of fields) {
    const structDef = lookupStructDefinition(
      mod,
      currentTypeName,
      S.zeroLocation("offset-of"),
    )
    let fieldOffset = 0
    let found = false

    for (const [fieldName, fieldType] of Object.entries(structDef.fields)) {
      if (fieldName === step) {
        if (fieldType.kind !== "NamedType") {
          let message = `offset-of cannot traverse non-named type: ${formatType(fieldType)}`
          throw new Error(message)
        }
        totalOffset += fieldOffset
        currentTypeName = fieldType.name
        found = true
        break
      }
      fieldOffset += typeSize(mod, fieldType)
    }

    if (!found) {
      let message = `field "${step}" not found in struct ${currentTypeName}`
      throw new Error(message)
    }
  }

  return totalOffset
}

export function resolveDisplacements(mod: Mod): void {
  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue
    for (const instr of definition.instrs) {
      for (const op of instr.operands) {
        if (
          op.kind === "RegMemOperand" &&
          op.disp !== undefined &&
          op.disp.kind === "OffsetOfDisplacement"
        ) {
          const value = offsetOf(mod, op.disp.structType, op.disp.fields)
          op.disp = {
            kind: "IntDisplacement",
            value,
          }
        }
      }
    }
  }
}

export function encodedDispOffset(enc: EncodedInstruction): number {
  let offset = enc.prefixes.length
  if (enc.rex !== null) offset += 1
  offset += enc.opcode.length
  if (enc.modRM !== null) offset += 1
  if (enc.sib !== null) offset += 1
  return offset
}

export function encodedImmOffset(enc: EncodedInstruction): number {
  let offset = encodedDispOffset(enc)
  if (enc.displacement !== null) offset += enc.displacement.size
  return offset
}
