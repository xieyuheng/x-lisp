import * as S from "@xieyuheng/sexp.js"
import { dataTypeUnfold, lookupStructDefinition } from "../check/check.ts"
import type { StructDefinition } from "../definition/index.ts"
import type { EncodedInstruction } from "../encode/index.ts"
import { encode, encodedSize } from "../encode/index.ts"
import type { Env } from "../evaluate/index.ts"
import { emptyEnv, envPutMany, evaluate } from "../evaluate/index.ts"
import type { Exp, StructField } from "../exp/index.ts"
import type { Instr } from "../instr/index.ts"
import type { Mod } from "../mod/index.ts"
import type { DataType, Type } from "../type/index.ts"
import { typeSize } from "../type/typeSize.ts"
import type { Value } from "../value/index.ts"

export type Relocation = {
  labelName: string
  labelPath: Array<string>
  instrEndPos: number
  fieldOffset: number
}

export type InternalReloc = {
  patchOffset: number
  targetOffset: number
}

type DataCtx = {
  mod: Mod
  buf: Uint8Array
  relocs: Array<InternalReloc>
}

const ALIGN_8 = 8

export function collectCodeLayout(
  mod: Mod,
  labels: Map<string, number>,
  relocations: Array<Relocation>,
  align: boolean = false,
): number {
  let pos = 0
  for (const def of mod.definitions.values()) {
    if (def.kind !== "CodeDefinition") continue

    if (align) {
      if (mod.metadataDefinitions.has(def.name)) {
        const placeholderPos = (pos + ALIGN_8 - 1) & ~(ALIGN_8 - 1)
        if (placeholderPos > pos) pos = placeholderPos
        pos += 8
      } else {
        pos = (pos + ALIGN_8 - 1) & ~(ALIGN_8 - 1)
      }
    }

    labels.set(def.name, pos)
    for (const block of def.blocks) {
      labels.set(block.name, pos)
      for (const instr of block.instrs) {
        if (instr.op === "label") {
          const labelOp = instr.operands[0]
          if (labelOp.kind === "LabelOperand") {
            labels.set(labelOp.name, pos)
          }
          continue
        }

        const encodings = encode(instr)
        const size = encodings.reduce((s, e) => s + encodedSize(e), 0)

        const labelInfo = extractLabelInfo(instr)
        if (labelInfo) {
          for (const enc of encodings) {
            if (enc.displacement !== null && enc.displacement.value === 0) {
              const dispOffset = encodedDispOffset(enc)
              relocations.push({
                labelName: labelInfo.name,
                labelPath: labelInfo.path,
                instrEndPos: pos + size,
                fieldOffset: pos + dispOffset,
              })
            }
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
}

export function emitDataSection(
  mod: Mod,
  labels: Map<string, number>,
  startImageOffset: number,
): EmittedData {
  const relocs: Array<InternalReloc> = []
  const totalSize = computeDataSectionSize(mod)
  const buf = new Uint8Array(totalSize)
  let pos = 0

  for (const def of mod.definitions.values()) {
    if (def.kind !== "DataDefinition") continue
    const claimedType = mod.claimedTypes.get(def.name)
    if (!claimedType || claimedType.kind !== "DataType") {
      let message = `unclaimed or non-struct data: ${def.name}`
      throw new S.ErrorWithSourceLocation(message, def.location)
    }

    labels.set(def.name, startImageOffset + pos)

    const structDef = lookupStructDefinition(
      mod,
      claimedType.typeConstructor.name,
      def.location,
    )
    const env = makeParamEnv(claimedType, structDef)
    recordSubfieldLabels(
      mod,
      labels,
      def.name,
      structDef.fields,
      env,
      startImageOffset + pos,
      0,
    )

    pos = emitFieldsTree(mod, claimedType, def.fields, buf, pos, relocs)
  }

  for (const [targetName, metaDef] of mod.metadataDefinitions) {
    if (!mod.codeMetadataType) {
      let message = "claim-code-metadata required when using define-metadata"
      throw new S.ErrorWithSourceLocation(message, metaDef.location)
    }
    labels.set(`.meta.${targetName}`, startImageOffset + pos)
    pos = emitFieldsTree(
      mod,
      mod.codeMetadataType as DataType,
      metaDef.fields,
      buf,
      pos,
      relocs,
    )
  }

  return { bytes: buf, relocs }
}

function computeDataSectionSize(mod: Mod): number {
  let total = 0
  for (const def of mod.definitions.values()) {
    if (def.kind !== "DataDefinition") continue
    const claimedType = mod.claimedTypes.get(def.name)
    if (!claimedType || claimedType.kind !== "DataType") {
      let message = `unclaimed data: ${def.name}`
      throw new S.ErrorWithSourceLocation(message, def.location)
    }
    total += computeFieldsTreeSize(mod, claimedType, def.fields)
  }
  for (const [, metaDef] of mod.metadataDefinitions) {
    if (!mod.codeMetadataType) continue
    total += computeFieldsTreeSize(
      mod,
      mod.codeMetadataType as DataType,
      metaDef.fields,
    )
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
    pos = emitFieldTree(mod, fieldType, field.exp, buf, pos, relocs, deferred)
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
    )
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
          fieldType as DataType,
          value.target,
          fieldExp,
          buf,
          pos,
          relocs,
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
  pointerType: DataType,
  targetValue: Value,
  originalExp: Exp,
  buf: Uint8Array,
  offset: number,
  relocs: Array<InternalReloc>,
): number {
  if (targetValue.kind === "StructValue") {
    const structExp = originalExp as {
      kind: string
      target: { kind: string; fields: Array<StructField> }
    }
    return emitFieldsTree(
      mod,
      pointerType.argTypes[0] as DataType,
      structExp.target.fields,
      buf,
      offset,
      relocs,
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

  if (value.kind === "PointerValue") {
    const inner = computePointerTargetSize(
      mod,
      fieldType as DataType,
      value.target,
      fieldExp,
    )
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
  pointerType: DataType,
  targetValue: Value,
  originalExp: Exp,
): number {
  if (targetValue.kind === "StructValue") {
    const structExp = originalExp as {
      kind: string
      target: { kind: string; fields: Array<StructField> }
    }
    return computeFieldsTreeSize(
      mod,
      pointerType.argTypes[0] as DataType,
      structExp.target.fields,
    )
  }

  if (targetValue.kind === "StringValue") {
    return targetValue.content.length + 1
  }

  let message = `unsupported pointer target: ${targetValue.kind}`
  throw new S.ErrorWithSourceLocation(message, originalExp.location)
}

export function recordSubfieldLabels(
  mod: Mod,
  labels: Map<string, number>,
  baseName: string,
  structFields: Array<StructField>,
  env: Env,
  baseOffset: number,
  currentOffset: number,
): void {
  let offset = currentOffset
  for (const field of structFields) {
    const fieldType = evaluateTypeFromExp(mod, env, field.exp)
    const key = `${baseName}/${field.name}`
    labels.set(key, baseOffset + offset)

    if (fieldType.kind === "DataType") {
      const subDef = mod.definitions.get(fieldType.typeConstructor.name)
      if (
        subDef &&
        subDef.kind === "StructDefinition" &&
        subDef.fields.length > 0
      ) {
        recordSubfieldLabels(
          mod,
          labels,
          key,
          subDef.fields,
          env,
          baseOffset + offset,
          0,
        )
      }
    }

    offset += typeSize(fieldType)
  }
}

export function computePathOffset(
  mod: Mod,
  baseName: string,
  path: Array<string>,
): number {
  if (path.length === 0) return 0

  const claimType = mod.claimedTypes.get(baseName)
  if (!claimType || claimType.kind !== "DataType") return 0

  let currentType = claimType
  let totalOffset = 0

  for (const step of path) {
    const structDef = lookupStructDefinition(
      mod,
      currentType.typeConstructor.name,
      S.zeroLocation("path-resolution"),
    )
    const env = makeParamEnv(currentType, structDef)
    let fieldOffset = 0
    let found = false

    for (const field of structDef.fields) {
      const fieldType = evaluateTypeFromExp(mod, env, field.exp)
      if (field.name === step) {
        totalOffset += fieldOffset
        if (fieldType.kind === "DataType") {
          currentType = fieldType
        }
        found = true
        break
      }
      fieldOffset += typeSize(fieldType)
    }

    if (!found) {
      let message = `field "${step}" not found in struct ${currentType.typeConstructor.name}`
      throw new Error(message)
    }
  }

  return totalOffset
}

export function extractLabelInfo(instr: Instr): {
  name: string
  path: Array<string>
} | null {
  for (const op of instr.operands) {
    if (op.kind === "LabelOperand") {
      return { name: op.name, path: op.path }
    }
    if (op.kind === "LabelImmOperand") {
      return { name: op.label.name, path: op.label.path }
    }
    if (op.kind === "LabelDerefOperand") {
      return { name: op.label.name, path: op.label.path }
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
  for (const def of mod.definitions.values()) {
    if (def.kind !== "CodeDefinition") continue

    if (mod.metadataDefinitions.has(def.name)) {
      const placeholderPos = (pos + ALIGN_8 - 1) & ~(ALIGN_8 - 1)
      if (placeholderPos > pos) pos = placeholderPos
      slots.push({ codeName: def.name, placeholderOffset: pos })
      pos += 8
    } else {
      pos = (pos + ALIGN_8 - 1) & ~(ALIGN_8 - 1)
    }

    for (const block of def.blocks) {
      for (const instr of block.instrs) {
        if (instr.op === "label") continue
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

function makeParamEnv(dataType: DataType, _structDef: StructDefinition): Env {
  const typeCtor = dataType.typeConstructor
  if (typeCtor.parameters.length > 0) {
    return envPutMany(
      emptyEnv(),
      typeCtor.parameters,
      dataType.argTypes.map((t) => ({ kind: "TypeValue" as const, type: t })),
    )
  }
  return emptyEnv()
}

function encodedDispOffset(enc: EncodedInstruction): number {
  let offset = enc.prefixes.length
  if (enc.rex !== null) offset += 1
  offset += enc.opcode.length
  if (enc.modRM !== null) offset += 1
  if (enc.sib !== null) offset += 1
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
