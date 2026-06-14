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

export type DataLayout = {
  offset: number
  bytes: Uint8Array
}

export function collectCodeLayout(
  mod: Mod,
  labels: Map<string, number>,
  relocations: Array<Relocation>,
): number {
  let pos = 0
  for (const def of mod.definitions.values()) {
    if (def.kind !== "CodeDefinition") continue
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

export function collectDataLayout(
  mod: Mod,
  labels: Map<string, number>,
  startOffset: number,
): Array<DataLayout> {
  const result: Array<DataLayout> = []
  let pos = startOffset

  for (const def of mod.definitions.values()) {
    if (def.kind !== "DataDefinition") continue
    const claimedType = mod.claimedTypes.get(def.name)
    if (!claimedType || claimedType.kind !== "DataType") {
      throw new Error(`unclaimed or non-struct data: ${def.name}`)
    }
    const dataType = claimedType

    const dataBytes = emitDataBytes(mod, dataType, def.fields)
    result.push({ offset: pos, bytes: dataBytes })

    labels.set(def.name, pos)

    const structDef = lookupStructDefinition(
      mod,
      dataType.typeConstructor.name,
      def.location,
    )
    const env = makeParamEnv(dataType, structDef)
    recordSubfieldLabels(mod, labels, def.name, structDef.fields, env, pos, 0)

    pos += dataBytes.length
  }

  return result
}

export function emitDataBytes(
  mod: Mod,
  dataType: DataType,
  fields: Array<StructField>,
): Uint8Array {
  const fieldTypes = dataTypeUnfold(mod, dataType, S.zeroLocation("data"))
  let totalSize = 0
  for (const [, type] of fieldTypes) {
    totalSize += typeSize(type)
  }

  const buf = new Uint8Array(totalSize)
  let offset = 0

  for (const field of fields) {
    const fieldType = fieldTypes.get(field.name)
    if (!fieldType) throw new Error(`unknown field: ${field.name}`)
    offset = emitValue(buf, offset, mod, fieldType, field.exp)
  }

  return buf
}

function emitValue(
  buf: Uint8Array,
  offset: number,
  mod: Mod,
  type: Type,
  exp: Exp,
): number {
  const value = evaluate(mod, emptyEnv(), exp)

  if (value.kind === "IntValue") {
    return writeIntLE(buf, offset, typeSize(type), value.value)
  }

  if (value.kind === "StructValue") {
    const fieldTypes = dataTypeUnfold(mod, type as DataType, exp.location)
    let pos = offset
    for (const [fieldName, fieldType] of fieldTypes) {
      const fieldValue = value.fields.get(fieldName)
      if (!fieldValue) throw new Error(`missing struct field: ${fieldName}`)
      pos = emitFlatValue(buf, pos, mod, fieldType, fieldValue)
    }
    return pos
  }

  throw new Error(`unsupported data value: ${value.kind}`)
}

function emitFlatValue(
  buf: Uint8Array,
  offset: number,
  mod: Mod,
  type: Type,
  value: Value,
): number {
  if (value.kind === "IntValue") {
    return writeIntLE(buf, offset, typeSize(type), value.value)
  }

  if (value.kind === "StructValue") {
    const fieldTypes = dataTypeUnfold(
      mod,
      type as DataType,
      S.zeroLocation("data"),
    )
    let pos = offset
    for (const [fieldName, fieldType] of fieldTypes) {
      const fieldValue = value.fields.get(fieldName)
      if (!fieldValue) throw new Error(`missing struct field: ${fieldName}`)
      pos = emitFlatValue(buf, pos, mod, fieldType, fieldValue)
    }
    return pos
  }

  throw new Error(`unsupported flat value: ${value.kind}`)
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
      throw new Error(
        `field "${step}" not found in struct ${currentType.typeConstructor.name}`,
      )
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

function evaluateTypeFromExp(mod: Mod, env: Env, exp: Exp): Type {
  const value = evaluate(mod, env, exp)
  if (value.kind === "TypeValue") return value.type
  if (
    value.kind === "TypeConstructorValue" &&
    value.typeConstructor.parameters.length === 0
  ) {
    const dt: DataType = {
      kind: "DataType",
      typeConstructor: value.typeConstructor,
      argTypes: [],
    }
    return dt
  }
  throw new Error(`expected type expression, got: ${value.kind}`)
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
