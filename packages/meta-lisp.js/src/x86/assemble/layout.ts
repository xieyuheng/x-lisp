import * as S from "@xieyuheng/sexp.js"
import {
  dataTypeUnfold,
  inferDataType,
  lookupStructDefinition,
} from "../check/check.ts"
import type { Data } from "../data/index.ts"
import type { EncodedInstruction } from "../encode/index.ts"
import { encode, encodedSize } from "../encode/index.ts"
import { formatType } from "../format/formatType.ts"
import type { Instr } from "../instr/index.ts"
import type { Mod } from "../mod/index.ts"
import type { Type } from "../type/index.ts"
import { NamedType } from "../type/Type.ts"
import { typeSize } from "../type/typeSize.ts"

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
          throw new Error(message)
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
    const dataType = inferDataType(mod, definition.value)

    labels.set(definition.name, startImageOffset + pos)

    pos = emitTopValue(
      mod,
      dataType,
      definition.value,
      buf,
      pos,
      relocs,
      addressRelocs,
    )
  }

  for (const [targetName, metaDef] of mod.metadataDefinitions) {
    labels.set(`.meta.${targetName}`, startImageOffset + pos)
    const { structType, structExp } = unpackMetadataStruct(
      mod,
      metaDef.value,
      S.zeroLocation("metaDef"),
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
  value: Data,
  location: S.SourceLocation,
): { structType: Type; structExp: { fields: Record<string, Data> } } {
  if (value.kind !== "PointerData" || value.target.kind !== "StructData") {
    let message = `[emitDataSection] define-metadata value must be (pointer (struct <name> ...))`
    throw new Error(message)
  }
  const structExp = value.target
  return {
    structType: structDataTypeByName(
      mod,
      structExp.name,
      S.zeroLocation("emitDataSection"),
    ),

    structExp,
  }
}

function structDataTypeByName(
  mod: Mod,
  name: string,
  location: S.SourceLocation,
): Type {
  lookupStructDefinition(mod, name, location)

  return NamedType(name)
}

function emitTopValue(
  mod: Mod,
  fieldType: Type,
  fieldExp: Data,
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
    const dataType = inferDataType(mod, definition.value)
    const r = computeFieldTreeSize(mod, dataType, definition.value)
    total += r.fixed + r.deferred
  }
  for (const [, metaDef] of mod.metadataDefinitions) {
    const { structType, structExp } = unpackMetadataStruct(
      mod,
      metaDef.value,
      S.zeroLocation("metaDef"),
    )
    total += computeFieldsTreeSize(mod, structType, structExp.fields)
  }
  return total
}

function emitFieldsTree(
  mod: Mod,
  dataType: Type,
  fields: Record<string, Data>,
  buf: Uint8Array,
  offset: number,
  relocs: Array<InternalReloc>,
  addressRelocs: Array<DataAddressReloc>,
): number {
  const fieldTypes = dataTypeUnfold(mod, dataType, S.zeroLocation("data"))
  const deferred: Array<{ off: number; fn: (pos: number) => number }> = []
  let pos = offset

  for (const [name, data] of Object.entries(fields)) {
    const fieldType = fieldTypes.get(name)
    if (!fieldType) {
      let message = `unknown field: ${name}`
      throw new Error(message)
    }
    pos = emitFieldTree(
      mod,
      fieldType,
      data,
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
  fieldData: Data,
  buf: Uint8Array,
  offset: number,
  relocs: Array<InternalReloc>,
  addressRelocs: Array<DataAddressReloc>,
  deferred: Array<{ off: number; fn: (pos: number) => number }>,
): number {
  if (fieldData.kind === "IntData") {
    return writeIntLE(buf, offset, typeSize(mod, fieldType), fieldData.value)
  }

  if (fieldData.kind === "StructData") {
    return emitFieldsTree(
      mod,
      fieldType,
      fieldData.fields,
      buf,
      offset,
      relocs,
      addressRelocs,
    )
  }

  if (fieldData.kind === "AddressData") {
    writeInt64(buf, offset, 0n)
    addressRelocs.push({
      patchOffset: offset,
      labelName: fieldData.name,
    })
    return offset + 8
  }

  if (fieldData.kind === "PointerData") {
    writeInt64(buf, offset, 0n)
    const placeholder = offset
    offset += 8
    deferred.push({
      off: 0,
      fn: (pos: number) => {
        const targetOff = pos
        const newPos = emitPointerTarget(
          mod,
          fieldData.target,
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

  if (fieldData.kind === "StringData") {
    if (typeSize(mod, fieldType) === 8) {
      writeInt64(buf, offset, 0n)
      const placeholder = offset
      offset += 8
      deferred.push({
        off: 0,
        fn: (pos: number) => {
          const targetOff = pos
          for (let i = 0; i < fieldData.content.length; i++) {
            buf[pos + i] = fieldData.content.charCodeAt(i)
          }
          buf[pos + fieldData.content.length] = 0
          const newPos = pos + fieldData.content.length + 1
          relocs.push({
            patchOffset: placeholder,
            targetOffset: targetOff,
          })
          return newPos
        },
      })
      return offset
    }
    for (let i = 0; i < fieldData.content.length; i++) {
      buf[offset + i] = fieldData.content.charCodeAt(i)
    }
    buf[offset + fieldData.content.length] = 0
    return offset + fieldData.content.length + 1
  }

  if (fieldData.kind === "ArrayData") {
    if (fieldType.kind !== "ArrayType") {
      let message = `[emitFieldTree] expected array type for array value`
      throw new Error(message)
    }
    let pos = offset
    const elemSize = typeSize(mod, fieldType.element)
    for (const elem of fieldData.elements) {
      if (elem.kind !== "IntData") {
        let message = `[emitFieldTree] array element must be integer, got: ${elem.kind}`
        throw new Error(message)
      }
      pos = writeIntLE(buf, pos, elemSize, elem.value)
    }
    return pos
  }

  let message = `unsupported data value`
  throw new Error(message)
}

function emitPointerTarget(
  mod: Mod,
  targetData: Data,
  buf: Uint8Array,
  offset: number,
  relocs: Array<InternalReloc>,
  addressRelocs: Array<DataAddressReloc>,
): number {
  if (targetData.kind === "StructData") {
    return emitFieldsTree(
      mod,
      structDataTypeByName(
        mod,
        targetData.name,
        S.zeroLocation("emitPointerTarget"),
      ),
      targetData.fields,
      buf,
      offset,
      relocs,
      addressRelocs,
    )
  }

  if (targetData.kind === "StringData") {
    for (let i = 0; i < targetData.content.length; i++) {
      buf[offset + i] = targetData.content.charCodeAt(i)
    }
    buf[offset + targetData.content.length] = 0
    return offset + targetData.content.length + 1
  }

  let message = `unsupported pointer target: ${targetData.kind}`
  throw new Error(message)
}

function computeFieldsTreeSize(
  mod: Mod,
  dataType: Type,
  fields: Record<string, Data>,
): number {
  const fieldTypes = dataTypeUnfold(mod, dataType, S.zeroLocation("data"))
  let total = 0
  let deferred = 0
  for (const [name, data] of Object.entries(fields)) {
    const fieldType = fieldTypes.get(name)
    if (!fieldType) {
      let message = `unknown field: ${name}`
      throw new Error(message)
    }
    const r = computeFieldTreeSize(mod, fieldType, data)
    total += r.fixed
    deferred += r.deferred
  }
  return total + deferred
}

type SizeResult = { fixed: number; deferred: number }

function computeFieldTreeSize(
  mod: Mod,
  fieldType: Type,
  fieldData: Data,
): SizeResult {
  if (fieldData.kind === "IntData") {
    return { fixed: typeSize(mod, fieldType), deferred: 0 }
  }

  if (fieldData.kind === "StructData") {
    return {
      fixed: computeFieldsTreeSize(mod, fieldType, fieldData.fields),
      deferred: 0,
    }
  }

  if (fieldData.kind === "AddressData") {
    return { fixed: 8, deferred: 0 }
  }

  if (fieldData.kind === "PointerData") {
    const inner = computePointerTargetSize(mod, fieldData.target)
    return { fixed: 8, deferred: inner }
  }

  if (fieldData.kind === "StringData") {
    if (typeSize(mod, fieldType) === 8) {
      return { fixed: 8, deferred: fieldData.content.length + 1 }
    }
    return { fixed: fieldData.content.length + 1, deferred: 0 }
  }

  if (fieldData.kind === "ArrayData") {
    return { fixed: typeSize(mod, fieldType), deferred: 0 }
  }

  let message = `unsupported data value`
  throw new Error(message)
}

function computePointerTargetSize(mod: Mod, targetData: Data): number {
  if (targetData.kind === "StructData") {
    return computeFieldsTreeSize(
      mod,
      structDataTypeByName(
        mod,
        targetData.name,
        S.zeroLocation("computePointerTargetSize"),
      ),
      targetData.fields,
    )
  }

  if (targetData.kind === "StringData") {
    return targetData.content.length + 1
  }

  let message = `unsupported pointer target: ${targetData.kind}`
  throw new Error(message)
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
