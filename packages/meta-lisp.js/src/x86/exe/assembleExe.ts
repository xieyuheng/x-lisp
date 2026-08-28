import * as S from "@xieyuheng/sexp.js"
import {
  encodedDispOffset,
  encodedImmOffset,
  resolveDisplacements,
} from "../assemble/layout.ts"
import {
  dataTypeUnfold,
  inferDataType,
  lookupStructDefinition,
} from "../check/check.ts"
import type { Data } from "../data/index.ts"
import { emitTo, encode, encodedSize } from "../encode/index.ts"
import type { Instr } from "../instr/index.ts"
import type { Program } from "../program/index.ts"
import type { Type } from "../type/index.ts"
import { NamedType } from "../type/Type.ts"
import { typeSize } from "../type/typeSize.ts"
import {
  ExeCodeSegment,
  ExeDataSegment,
  ExeSpaceSegment,
  type Exe,
  type ExeRelocationEntry,
  type ExeSegmentKind,
} from "./types.ts"

type LabelInfo = { segmentKind: ExeSegmentKind; segmentOffset: number }

export function assembleExe(program: Program, entryName?: string): Exe {
  resolveDisplacements(program)

  const labels = new Map<string, LabelInfo>()
  const relocs: Array<ExeRelocationEntry> = []

  const code = emitExeCode(program, labels, relocs)
  const data = emitExeData(program, labels, relocs)

  let spaceSize = 0
  for (const definition of program.definitions.values()) {
    if (definition.kind !== "SpaceDefinition") continue
    const size = definition.size
    if (size.kind !== "IntData") {
      let message = `define-space size must be integer, got: ${size.kind}`
      throw new Error(message)
    }
    const s = Number(size.content)
    labels.set(definition.name, {
      segmentKind: ExeSpaceSegment,
      segmentOffset: spaceSize,
    })
    spaceSize += s
  }

  const resolvedEntryName = entryName || "main"
  const entry = labels.get(resolvedEntryName)
  if (entry === undefined) {
    let message = `entry name not found: ${resolvedEntryName}`
    throw new Error(message)
  }
  if (entry.segmentKind !== ExeCodeSegment) {
    let message = `entry "${resolvedEntryName}" is not a code segment label`
    throw new Error(message)
  }

  const labelTable = [...labels.entries()].map(([name, info]) => ({
    name,
    segmentKind: info.segmentKind,
    segmentOffset: info.segmentOffset,
  }))

  return {
    code,
    data,
    spaceSize,
    entryCodeSegmentOffset: entry.segmentOffset,
    labelTable,
    relocationTable: relocs,
  }
}

// ---------------------------------------------------------------------------
// code emission
// ---------------------------------------------------------------------------

function collectLocalLabels(program: Program): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()
  for (const definition of program.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue
    const local = new Set<string>()
    map.set(definition.name, local)
    for (const instr of definition.instrs) {
      if (instr.op !== "label") continue
      const [op] = instr.operands
      if (op.kind === "LabelOperand") local.add(op.name)
    }
  }
  return map
}

function scopedName(fnName: string, labelName: string): string {
  return fnName + "/" + labelName
}

type CodeRelocInfo = null | {
  type: string
  name: string
  holeKind: "disp32" | "imm64"
}

function findCodeRelocInfo(instr: Instr): CodeRelocInfo {
  for (const op of instr.operands) {
    if (op.kind === "LabelOperand")
      return { type: "label-rel32", name: op.name, holeKind: "disp32" }
    if (op.kind === "AddressOperand")
      return { type: "label-rel32", name: op.name, holeKind: "disp32" }
    if (op.kind === "RipMemOperand")
      return { type: "label-rel32", name: op.address.name, holeKind: "disp32" }
    if (op.kind === "ExternOperand")
      return { type: "extern", name: op.name, holeKind: "imm64" }
    if (op.kind === "RelocationOperand")
      return { type: op.type, name: op.name, holeKind: "imm64" }
  }
  return null
}

function emitExeCode(
  program: Program,
  labels: Map<string, LabelInfo>,
  relocs: Array<ExeRelocationEntry>,
): Uint8Array {
  const localLabels = collectLocalLabels(program)

  let pos = 0
  for (const definition of program.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue

    pos = (pos + 7) & ~7

    const fnLocalLabels = localLabels.get(definition.name)!

    labels.set(definition.name, {
      segmentKind: ExeCodeSegment,
      segmentOffset: pos,
    })

    for (const instr of definition.instrs) {
      if (instr.op === "label") {
        const [op] = instr.operands
        if (op.kind !== "LabelOperand") {
          let message = `[emitExeCode] label instruction must have LabelOperand`
          throw new Error(message)
        }
        labels.set(scopedName(definition.name, op.name), {
          segmentKind: ExeCodeSegment,
          segmentOffset: pos,
        })
        continue
      }

      const encodings = encode(instr)
      const size = encodings.reduce((s, e) => s + encodedSize(e), 0)

      const relocInfo = findCodeRelocInfo(instr)
      if (relocInfo) {
        const resolvedName = fnLocalLabels.has(relocInfo.name)
          ? scopedName(definition.name, relocInfo.name)
          : relocInfo.name

        let instrPos = pos
        for (const enc of encodings) {
          if (
            relocInfo.holeKind === "disp32" &&
            enc.displacement !== null &&
            enc.displacement.value === 0
          ) {
            // - addend = -(rip - hole), where rip is the address of the
            //   next instruction. Encoders know the instruction layout,
            //   so they compute it; the loader just applies S + A - P.
            const dispOffset = encodedDispOffset(enc)
            const addend = BigInt(dispOffset - encodedSize(enc))
            relocs.push({
              type: relocInfo.type,
              name: resolvedName,
              segmentKind: ExeCodeSegment,
              segmentOffset: instrPos + dispOffset,
              addend,
            })
          } else if (
            relocInfo.holeKind === "imm64" &&
            enc.immediate !== null &&
            enc.immediate.value === 0n
          ) {
            relocs.push({
              type: relocInfo.type,
              name: resolvedName,
              segmentKind: ExeCodeSegment,
              segmentOffset: instrPos + encodedImmOffset(enc),
              addend: 0n,
            })
          }
          instrPos += encodedSize(enc)
        }
      }

      pos += size
    }
  }

  const buf = new Uint8Array(pos)
  pos = 0

  for (const definition of program.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue

    pos = (pos + 7) & ~7

    for (const instr of definition.instrs) {
      if (instr.op === "label") continue
      for (const enc of encode(instr)) {
        pos = emitTo(enc, buf, pos)
      }
    }
  }

  return buf
}

// ---------------------------------------------------------------------------
// data emission
// ---------------------------------------------------------------------------

type DeferredItem = {
  pointerSlotOffset: number
  emit: (start: number) => number
}

function emitExeData(
  program: Program,
  labels: Map<string, LabelInfo>,
  relocs: Array<ExeRelocationEntry>,
): Uint8Array {
  let anonCounter = maxAnonIndex(program) + 1

  let totalSize = 0
  for (const definition of program.definitions.values()) {
    if (definition.kind !== "DataDefinition") continue
    const dataType = inferDataType(program, definition.value)
    totalSize += computeTreeSize(program, dataType, definition.value)
  }

  const buf = new Uint8Array(totalSize)
  let pos = 0

  for (const definition of program.definitions.values()) {
    if (definition.kind !== "DataDefinition") continue

    const dataType = inferDataType(program, definition.value)

    labels.set(definition.name, {
      segmentKind: ExeDataSegment,
      segmentOffset: pos,
    })

    const deferred: Array<DeferredItem> = []

    pos = emitTree(
      program,
      dataType,
      definition.value,
      buf,
      pos,
      relocs,
      deferred,
    )

    while (deferred.length > 0) {
      const d = deferred.shift()!
      const targetStart = pos
      pos = d.emit(pos)
      const anonName = `\xa9data.${anonCounter++}`
      labels.set(anonName, {
        segmentKind: ExeDataSegment,
        segmentOffset: targetStart,
      })
      relocs.push({
        type: "label-abs64",
        name: anonName,
        segmentKind: ExeDataSegment,
        segmentOffset: d.pointerSlotOffset,
        addend: 0n,
      })
    }
  }

  return buf
}

function maxAnonIndex(program: Program): number {
  let max = -1
  for (const name of program.definitions.keys()) {
    const m = name.match(/^\xa9data\.(\d+)$/)
    if (m) {
      const n = parseInt(m[1])
      if (n > max) max = n
    }
  }
  return max
}

function computeTreeSize(
  program: Program,
  dataType: Type,
  value: Data,
): number {
  if (value.kind === "IntData") return typeSize(program, dataType)

  if (value.kind === "StructData") {
    const fieldTypes = dataTypeUnfold(program, dataType, S.zeroLocation("data"))
    let total = 0
    for (const [name, data] of Object.entries(value.fields)) {
      const ft = fieldTypes.get(name)
      if (!ft) {
        let message = `unknown field: ${name}`
        throw new Error(message)
      }
      total += computeTreeSize(program, ft, data)
    }
    return total
  }

  if (value.kind === "AddressData") return 8

  if (value.kind === "PointerData") {
    const inner = computePointerTargetSize(program, value.target)
    return 8 + inner
  }

  if (value.kind === "StringData") {
    if (typeSize(program, dataType) === 8) {
      return 8 + value.content.length + 1
    }
    return value.content.length + 1
  }

  if (value.kind === "ArrayData") return typeSize(program, dataType)

  let message = `unsupported data value`
  throw new Error(message)
}

function computePointerTargetSize(program: Program, target: Data): number {
  if (target.kind === "StructData") {
    return computeTreeSize(
      program,
      structDataType(program, target.name, S.zeroLocation("data")),
      target,
    )
  }
  if (target.kind === "StringData") return target.content.length + 1
  let message = `unsupported pointer target: ${target.kind}`
  throw new Error(message)
}

function emitTree(
  program: Program,
  dataType: Type,
  value: Data,
  buf: Uint8Array,
  offset: number,
  relocs: Array<ExeRelocationEntry>,
  deferred: Array<DeferredItem>,
): number {
  if (value.kind === "IntData") {
    return writeIntLE(buf, offset, typeSize(program, dataType), value.content)
  }

  if (value.kind === "StructData") {
    const fieldTypes = dataTypeUnfold(program, dataType, S.zeroLocation("data"))
    let pos = offset
    for (const [name, data] of Object.entries(value.fields)) {
      const ft = fieldTypes.get(name)
      if (!ft) {
        let message = `unknown field: ${name}`
        throw new Error(message)
      }
      pos = emitTree(program, ft, data, buf, pos, relocs, deferred)
    }
    return pos
  }

  if (value.kind === "AddressData") {
    writeInt64(buf, offset, 0n)
    relocs.push({
      type: "label-abs64",
      name: value.name,
      segmentKind: ExeDataSegment,
      segmentOffset: offset,
      addend: 0n,
    })
    return offset + 8
  }

  if (value.kind === "PointerData") {
    writeInt64(buf, offset, 0n)
    const pointerSlotOffset = offset
    offset += 8
    deferred.push({
      pointerSlotOffset,
      emit: (start: number) =>
        emitPointerTarget(program, value.target, buf, start, relocs, deferred),
    })
    return offset
  }

  if (value.kind === "StringData") {
    if (typeSize(program, dataType) === 8) {
      writeInt64(buf, offset, 0n)
      const pointerSlotOffset = offset
      offset += 8
      deferred.push({
        pointerSlotOffset,
        emit: (start: number) => {
          const text = value.content
          for (let i = 0; i < text.length; i++) {
            buf[start + i] = text.charCodeAt(i)
          }
          buf[start + text.length] = 0
          return start + text.length + 1
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

  if (value.kind === "ArrayData") {
    if (dataType.kind !== "ArrayType") {
      let message = `expected array type for array value`
      throw new Error(message)
    }
    let pos = offset
    const elemSize = typeSize(program, dataType.element)
    for (const elem of value.elements) {
      if (elem.kind !== "IntData") {
        let message = `array element must be integer, got: ${elem.kind}`
        throw new Error(message)
      }
      pos = writeIntLE(buf, pos, elemSize, elem.content)
    }
    return pos
  }

  let message = `unsupported data value`
  throw new Error(message)
}

function structDataType(
  program: Program,
  name: string,
  location: S.SourceLocation,
): Type {
  lookupStructDefinition(program, name, location)
  return NamedType(name)
}

function emitPointerTarget(
  program: Program,
  target: Data,
  buf: Uint8Array,
  offset: number,
  relocs: Array<ExeRelocationEntry>,
  deferred: Array<DeferredItem>,
): number {
  if (target.kind === "StructData") {
    return emitTree(
      program,
      structDataType(program, target.name, S.zeroLocation("emitPointerTarget")),
      target,
      buf,
      offset,
      relocs,
      deferred,
    )
  }

  if (target.kind === "StringData") {
    for (let i = 0; i < target.content.length; i++) {
      buf[offset + i] = target.content.charCodeAt(i)
    }
    buf[offset + target.content.length] = 0
    return offset + target.content.length + 1
  }

  let message = `unsupported pointer target: ${target.kind}`
  throw new Error(message)
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function writeIntLE(
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

function writeInt64(buf: Uint8Array, offset: number, value: bigint): void {
  writeIntLE(buf, offset, 8, value)
}
