import * as S from "@xieyuheng/sexp.js"
import { dataTypeUnfold, lookupStructDefinition } from "../check/check.ts"
import type { EncodedInstruction } from "../encode/index.ts"
import { encode, encodedSize } from "../encode/index.ts"
import type { Env } from "../evaluate/index.ts"
import { emptyEnv, evaluate } from "../evaluate/index.ts"
import type { Exp, StructField } from "../exp/index.ts"
import type { Instr } from "../instr/index.ts"
import type { Mod } from "../mod/index.ts"
import type { DataType, Type } from "../type/index.ts"
import { typeSize } from "../type/typeSize.ts"
import type { Value } from "../value/index.ts"

export type Relocation = {
  labelName: string
  instrEndPos: number
  fieldOffset: number
}

export type InternalReloc = {
  patchOffset: number
  targetOffset: number
}

export type DataAddressReloc = {
  patchOffset: number
  labelName: string
}

export type ExternalReloc = {
  patchOffset: number
  symbolName: string
}

type DataCtx = {
  mod: Mod
  buf: Uint8Array
  relocs: Array<InternalReloc>
}

const ALIGN_8 = 8

function collectLocalLabels(mod: Mod): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()
  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue
    const local = new Set<string>()
    map.set(definition.name, local)
    for (const block of definition.blocks) {
      local.add(block.name)
    }
  }
  return map
}

function scopedName(fnName: string, labelName: string): string {
  return fnName + "/" + labelName
}

export function collectCodeLayout(
  mod: Mod,
  labels: Map<string, number>,
  relocations: Array<Relocation>,
  align: boolean = false,
  externalRelocs?: Array<ExternalReloc>,
): number {
  const localLabels = collectLocalLabels(mod)
  let pos = 0
  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue

    if (align) {
      if (mod.metadataDefinitions.has(definition.name)) {
        const placeholderPos = (pos + ALIGN_8 - 1) & ~(ALIGN_8 - 1)
        if (placeholderPos > pos) pos = placeholderPos
        pos += 8
      } else {
        pos = (pos + ALIGN_8 - 1) & ~(ALIGN_8 - 1)
      }
    }

    const fnLocalLabels = localLabels.get(definition.name)!

    labels.set(definition.name, pos)
    for (const block of definition.blocks) {
      labels.set(scopedName(definition.name, block.name), pos)
      for (const instr of block.instrs) {
        if (instr.op === "label") {
          let message =
            "(label ...) cannot be an instruction; labels are defined by blocks"
          throw new S.ErrorWithSourceLocation(message, instr.location)
        }

        const encodings = encode(instr)
        const size = encodings.reduce((s, e) => s + encodedSize(e), 0)

        const labelInfo = extractLabelInfo(instr)
        if (labelInfo) {
          const resolveName = fnLocalLabels.has(labelInfo.name)
            ? scopedName(definition.name, labelInfo.name)
            : labelInfo.name
          for (const enc of encodings) {
            if (enc.displacement !== null && enc.displacement.value === 0) {
              const dispOffset = encodedDispOffset(enc)
              relocations.push({
                labelName: resolveName,
                instrEndPos: pos + size,
                fieldOffset: pos + dispOffset,
              })
            }
          }
        }

        if (externalRelocs) {
          let instrPos = pos
          for (const enc of encodings) {
            if (enc.externalReloc) {
              const immOffset = encodedImmOffset(enc)
              externalRelocs.push({
                patchOffset: instrPos + immOffset,
                symbolName: enc.externalReloc.symbolName,
              })
            }
            instrPos += encodedSize(enc)
          }
        }

        pos += size
      }
    }
  }
  return pos
}

export type EmittedData = {
  bytes: Uint8Array
  relocs: Array<InternalReloc>
  addressRelocs: Array<DataAddressReloc>
}

export function emitDataSection(
  mod: Mod,
  labels: Map<string, number>,
  startImageOffset: number,
): EmittedData {
  const relocs: Array<InternalReloc> = []
  const addressRelocs: Array<DataAddressReloc> = []
  const totalSize = computeDataSectionSize(mod)
  const buf = new Uint8Array(totalSize)
  let pos = 0

  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "DataDefinition") continue
    const claimedType = mod.claimedTypes.get(definition.name)
    if (!claimedType) {
      let message = `unclaimed data: ${definition.name}`
      throw new S.ErrorWithSourceLocation(message, definition.location)
    }

    labels.set(definition.name, startImageOffset + pos)

    pos = emitTopValue(
      mod,
      claimedType,
      definition.value,
      buf,
      pos,
      relocs,
      addressRelocs,
    )
  }

  for (const [targetName, metaDef] of mod.metadataDefinitions) {
    if (!mod.codeMetadataType) {
      let message = "claim-code-metadata required when using define-metadata"
      throw new S.ErrorWithSourceLocation(message, metaDef.location)
    }
    labels.set(`.meta.${targetName}`, startImageOffset + pos)
    const { structType, structExp } = unpackMetadataStruct(
      mod,
      metaDef.value,
      metaDef.location,
    )
    pos = emitFieldsTree(
      mod,
      structType,
      structExp.fields,
      buf,
      pos,
      relocs,
      addressRelocs,
    )
  }

  return { bytes: buf, relocs, addressRelocs }
}

function unpackMetadataStruct(
  mod: Mod,
  value: Exp,
  location: S.SourceLocation,
): { structType: DataType; structExp: { fields: Array<StructField> } } {
  if (value.kind !== "PointerExp" || value.target.kind !== "StructExp") {
    let message = `[emitDataSection] define-metadata value must be (pointer (struct <name> ...))`
    throw new S.ErrorWithSourceLocation(message, location)
  }
  const structExp = value.target
  if (structExp.name === undefined) {
    let message = `[emitDataSection] metadata struct must be named (opaque pointer requires an explicit struct type)`
    throw new S.ErrorWithSourceLocation(message, location)
  }
  return {
    structType: structDataTypeByName(mod, structExp.name, location),
    structExp,
  }
}

function structDataTypeByName(
  mod: Mod,
  name: string,
  location: S.SourceLocation,
): DataType {
  const structDef = lookupStructDefinition(mod, name, location)
  return {
    kind: "DataType",
    typeConstructor: structDef.typeConstructor,
    argTypes: [],
  }
}

function emitTopValue(
  mod: Mod,
  fieldType: Type,
  fieldExp: Exp,
  buf: Uint8Array,
  offset: number,
  relocs: Array<InternalReloc>,
  addressRelocs: Array<DataAddressReloc>,
): number {
  const deferred: Array<{ off: number; fn: (pos: number) => number }> = []
  let pos = emitFieldTree(
    mod,
    fieldType,
    fieldExp,
    buf,
    offset,
    relocs,
    addressRelocs,
    deferred,
  )
  for (const d of deferred) {
    d.off = pos
    pos = d.fn(pos)
  }
  return pos
}

function computeDataSectionSize(mod: Mod): number {
  let total = 0
  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "DataDefinition") continue
    const claimedType = mod.claimedTypes.get(definition.name)
    if (!claimedType) {
      let message = `unclaimed data: ${definition.name}`
      throw new S.ErrorWithSourceLocation(message, definition.location)
    }
    const r = computeFieldTreeSize(mod, claimedType, definition.value)
    total += r.fixed + r.deferred
  }
  for (const [, metaDef] of mod.metadataDefinitions) {
    if (!mod.codeMetadataType) continue
    const { structType, structExp } = unpackMetadataStruct(
      mod,
      metaDef.value,
      metaDef.location,
    )
    total += computeFieldsTreeSize(mod, structType, structExp.fields)
  }
  return total
}

function emitFieldsTree(
  mod: Mod,
  dataType: DataType,
  fields: Array<StructField>,
  buf: Uint8Array,
  offset: number,
  relocs: Array<InternalReloc>,
  addressRelocs: Array<DataAddressReloc>,
): number {
  const fieldTypes = dataTypeUnfold(mod, dataType, S.zeroLocation("data"))
  const deferred: Array<{ off: number; fn: (pos: number) => number }> = []
  let pos = offset

  for (const field of fields) {
    const fieldType = fieldTypes.get(field.name)
    if (!fieldType) {
      let message = `unknown field: ${field.name}`
      throw new S.ErrorWithSourceLocation(message, field.exp.location)
    }
    pos = emitFieldTree(
      mod,
      fieldType,
      field.exp,
      buf,
      pos,
      relocs,
      addressRelocs,
      deferred,
    )
  }

  for (const d of deferred) {
    d.off = pos
    pos = d.fn(pos)
  }

  return pos
}

function emitFieldTree(
  mod: Mod,
  fieldType: Type,
  fieldExp: Exp,
  buf: Uint8Array,
  offset: number,
  relocs: Array<InternalReloc>,
  addressRelocs: Array<DataAddressReloc>,
  deferred: Array<{ off: number; fn: (pos: number) => number }>,
): number {
  const value = evaluate(mod, emptyEnv(), fieldExp)

  if (value.kind === "IntValue") {
    return writeIntLE(buf, offset, typeSize(fieldType), value.value)
  }

  if (value.kind === "StructValue") {
    return emitFieldsTree(
      mod,
      fieldType as DataType,
      (fieldExp as { kind: string; fields: Array<StructField> }).fields,
      buf,
      offset,
      relocs,
      addressRelocs,
    )
  }

  if (value.kind === "AddressValue") {
    writeInt64(buf, offset, 0n)
    addressRelocs.push({
      patchOffset: offset,
      labelName: value.name,
    })
    return offset + 8
  }

  if (value.kind === "PointerValue") {
    writeInt64(buf, offset, 0n)
    const placeholder = offset
    offset += 8
    deferred.push({
      off: 0,
      fn: (pos: number) => {
        const targetOff = pos
        const newPos = emitPointerTarget(
          mod,
          value.target,
          fieldExp,
          buf,
          pos,
          relocs,
          addressRelocs,
        )
        relocs.push({
          patchOffset: placeholder,
          targetOffset: targetOff,
        })
        return newPos
      },
    })
    return offset
  }

  if (value.kind === "StringValue") {
    if (typeSize(fieldType) === 8) {
      writeInt64(buf, offset, 0n)
      const placeholder = offset
      offset += 8
      deferred.push({
        off: 0,
        fn: (pos: number) => {
          const targetOff = pos
          for (let i = 0; i < value.content.length; i++) {
            buf[pos + i] = value.content.charCodeAt(i)
          }
          buf[pos + value.content.length] = 0
          const newPos = pos + value.content.length + 1
          relocs.push({
            patchOffset: placeholder,
            targetOffset: targetOff,
          })
          return newPos
        },
      })
      return offset
    }
    for (let i = 0; i < value.content.length; i++) {
      buf[offset + i] = value.content.charCodeAt(i)
    }
    buf[offset + value.content.length] = 0
    return offset + value.content.length + 1
  }

  let message = `unsupported data value: ${value.kind}`
  throw new S.ErrorWithSourceLocation(message, fieldExp.location)
}

function emitPointerTarget(
  mod: Mod,
  targetValue: Value,
  originalExp: Exp,
  buf: Uint8Array,
  offset: number,
  relocs: Array<InternalReloc>,
  addressRelocs: Array<DataAddressReloc>,
): number {
  if (targetValue.kind === "StructValue") {
    if (targetValue.name === undefined) {
      let message = `pointer target struct must be named`
      throw new S.ErrorWithSourceLocation(message, originalExp.location)
    }
    const structExp = originalExp as {
      kind: string
      target: { kind: string; fields: Array<StructField> }
    }
    return emitFieldsTree(
      mod,
      structDataTypeByName(mod, targetValue.name, originalExp.location),
      structExp.target.fields,
      buf,
      offset,
      relocs,
      addressRelocs,
    )
  }

  if (targetValue.kind === "StringValue") {
    for (let i = 0; i < targetValue.content.length; i++) {
      buf[offset + i] = targetValue.content.charCodeAt(i)
    }
    buf[offset + targetValue.content.length] = 0
    return offset + targetValue.content.length + 1
  }

  let message = `unsupported pointer target: ${targetValue.kind}`
  throw new S.ErrorWithSourceLocation(message, originalExp.location)
}

function computeFieldsTreeSize(
  mod: Mod,
  dataType: DataType,
  fields: Array<StructField>,
): number {
  const fieldTypes = dataTypeUnfold(mod, dataType, S.zeroLocation("data"))
  let total = 0
  let deferred = 0
  for (const field of fields) {
    const fieldType = fieldTypes.get(field.name)
    if (!fieldType) {
      let message = `unknown field: ${field.name}`
      throw new S.ErrorWithSourceLocation(message, field.exp.location)
    }
    const r = computeFieldTreeSize(mod, fieldType, field.exp)
    total += r.fixed
    deferred += r.deferred
  }
  return total + deferred
}

type SizeResult = { fixed: number; deferred: number }

function computeFieldTreeSize(
  mod: Mod,
  fieldType: Type,
  fieldExp: Exp,
): SizeResult {
  const value = evaluate(mod, emptyEnv(), fieldExp)

  if (value.kind === "IntValue") {
    return { fixed: typeSize(fieldType), deferred: 0 }
  }

  if (value.kind === "StructValue") {
    return {
      fixed: computeFieldsTreeSize(
        mod,
        fieldType as DataType,
        (fieldExp as { kind: string; fields: Array<StructField> }).fields,
      ),
      deferred: 0,
    }
  }

  if (value.kind === "AddressValue") {
    return { fixed: 8, deferred: 0 }
  }

  if (value.kind === "PointerValue") {
    const inner = computePointerTargetSize(mod, value.target, fieldExp)
    return { fixed: 8, deferred: inner }
  }

  if (value.kind === "StringValue") {
    if (typeSize(fieldType) === 8) {
      return { fixed: 8, deferred: value.content.length + 1 }
    }
    return { fixed: value.content.length + 1, deferred: 0 }
  }

  let message = `unsupported data value: ${value.kind}`
  throw new S.ErrorWithSourceLocation(message, fieldExp.location)
}

function computePointerTargetSize(
  mod: Mod,
  targetValue: Value,
  originalExp: Exp,
): number {
  if (targetValue.kind === "StructValue") {
    if (targetValue.name === undefined) {
      let message = `pointer target struct must be named`
      throw new S.ErrorWithSourceLocation(message, originalExp.location)
    }
    const structExp = originalExp as {
      kind: string
      target: { kind: string; fields: Array<StructField> }
    }
    return computeFieldsTreeSize(
      mod,
      structDataTypeByName(mod, targetValue.name, originalExp.location),
      structExp.target.fields,
    )
  }

  if (targetValue.kind === "StringValue") {
    return targetValue.content.length + 1
  }

  let message = `unsupported pointer target: ${targetValue.kind}`
  throw new S.ErrorWithSourceLocation(message, originalExp.location)
}

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

    for (const field of structDef.fields) {
      const fieldType = evaluateTypeFromExp(mod, emptyEnv(), field.exp)
      if (field.name === step) {
        totalOffset += fieldOffset
        if (fieldType.kind === "DataType") {
          currentTypeName = fieldType.typeConstructor.name
        }
        found = true
        break
      }
      fieldOffset += typeSize(fieldType)
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
    for (const block of definition.blocks) {
      for (const instr of block.instrs) {
        for (const op of instr.operands) {
          if (
            op.kind === "RegDerefOperand" &&
            op.disp !== undefined &&
            op.disp.kind === "OffsetOfDisplacement"
          ) {
            const value = BigInt(
              offsetOf(mod, op.disp.structType, op.disp.fields),
            )
            op.disp = {
              kind: "IntDisplacement",
              value,
              location: op.disp.location,
            }
          }
        }
      }
    }
  }
}

export function extractLabelInfo(instr: Instr): { name: string } | null {
  for (const op of instr.operands) {
    if (op.kind === "LabelOperand") {
      return { name: op.name }
    }
    if (op.kind === "AddressOperand") {
      return { name: op.name }
    }
    if (op.kind === "DerefOperand") {
      return { name: op.address.name }
    }
  }
  return null
}

export type MetadataSlots = Array<{
  codeName: string
  placeholderOffset: number
}>

export function collectMetadataSlots(mod: Mod): MetadataSlots {
  const slots: MetadataSlots = []
  let pos = 0
  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue

    if (mod.metadataDefinitions.has(definition.name)) {
      const placeholderPos = (pos + ALIGN_8 - 1) & ~(ALIGN_8 - 1)
      if (placeholderPos > pos) pos = placeholderPos
      slots.push({ codeName: definition.name, placeholderOffset: pos })
      pos += 8
    } else {
      pos = (pos + ALIGN_8 - 1) & ~(ALIGN_8 - 1)
    }

    for (const block of definition.blocks) {
      for (const instr of block.instrs) {
        const encodings = encode(instr)
        pos += encodings.reduce((s, e) => s + encodedSize(e), 0)
      }
    }
  }
  return slots
}

function evaluateTypeFromExp(mod: Mod, env: Env, exp: Exp): Type {
  const value = evaluate(mod, env, exp)
  if (value.kind === "TypeValue") return value.type
  if (
    value.kind === "TypeConstructorValue" &&
    value.typeConstructor.parameters.length === 0
  ) {
    return {
      kind: "DataType",
      typeConstructor: value.typeConstructor,
      argTypes: [],
    }
  }
  let message = `expected type expression, got: ${value.kind}`
  throw new S.ErrorWithSourceLocation(message, exp.location)
}

function encodedDispOffset(enc: EncodedInstruction): number {
  let offset = enc.prefixes.length
  if (enc.rex !== null) offset += 1
  offset += enc.opcode.length
  if (enc.modRM !== null) offset += 1
  if (enc.sib !== null) offset += 1
  return offset
}

function encodedImmOffset(enc: EncodedInstruction): number {
  let offset = encodedDispOffset(enc)
  if (enc.displacement !== null) offset += enc.displacement.size
  return offset
}

export function writeInt32LE(
  buf: Uint8Array,
  offset: number,
  value: number,
): void {
  buf[offset] = value & 0xff
  buf[offset + 1] = (value >> 8) & 0xff
  buf[offset + 2] = (value >> 16) & 0xff
  buf[offset + 3] = (value >> 24) & 0xff
}

export function writeIntLE(
  buf: Uint8Array,
  offset: number,
  size: number,
  value: bigint,
): number {
  for (let i = 0; i < size; i++) {
    buf[offset + i] = Number((value >> BigInt(i * 8)) & 0xffn)
  }
  return offset + size
}

export function writeInt64(
  buf: Uint8Array,
  offset: number,
  value: bigint,
): void {
  writeIntLE(buf, offset, 8, value)
}

export function writeU32LE(
  buf: Uint8Array,
  offset: number,
  value: number,
): void {
  buf[offset] = value & 0xff
  buf[offset + 1] = (value >> 8) & 0xff
  buf[offset + 2] = (value >> 16) & 0xff
  buf[offset + 3] = (value >> 24) & 0xff
}
