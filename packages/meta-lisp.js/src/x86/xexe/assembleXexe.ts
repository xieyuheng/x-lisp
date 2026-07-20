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
import type { Mod } from "../mod/index.ts"
import type { Type } from "../type/index.ts"
import { NamedType } from "../type/Type.ts"
import { typeSize } from "../type/typeSize.ts"
import {
  XexeCodeSegment,
  XexeDataSegment,
  XexeSpaceSegment,
  type Xexe,
  type XexeRelocationEntry,
  type XexeSegmentKind,
} from "./types.ts"

type LabelInfo = { segmentKind: XexeSegmentKind; segmentOffset: number }

export function assembleXexe(mod: Mod, entryName?: string): Xexe {
  resolveDisplacements(mod)

  const labels = new Map<string, LabelInfo>()
  const relocs: Array<XexeRelocationEntry> = []

  const code = emitXexeCode(mod, labels, relocs)
  const data = emitXexeData(mod, labels, relocs)

  let spaceSize = 0
  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "SpaceDefinition") continue
    const size = definition.size
    if (size.kind !== "IntData") {
      let message = `define-space size must be integer, got: ${size.kind}`
      throw new Error(message)
    }
    const s = Number(size.content)
    labels.set(definition.name, {
      segmentKind: XexeSpaceSegment,
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
  if (entry.segmentKind !== XexeCodeSegment) {
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

function collectLocalLabels(mod: Mod): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()
  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue
    const local = new Set<string>()
    map.set(definition.name, local)
    for (const block of definition.blocks) {
      local.add(block.label)
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
    if (op.kind === "DerefOperand")
      return { type: "label-rel32", name: op.address.name, holeKind: "disp32" }
    if (op.kind === "ExternOperand")
      return { type: "extern", name: op.name, holeKind: "imm64" }
    if (op.kind === "RelocationOperand")
      return { type: op.type, name: op.name, holeKind: "imm64" }
  }
  return null
}

function emitXexeCode(
  mod: Mod,
  labels: Map<string, LabelInfo>,
  relocs: Array<XexeRelocationEntry>,
): Uint8Array {
  const localLabels = collectLocalLabels(mod)

  let pos = 0
  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue

    pos = (pos + 7) & ~7

    const fnLocalLabels = localLabels.get(definition.name)!

    labels.set(definition.name, {
      segmentKind: XexeCodeSegment,
      segmentOffset: pos,
    })

    for (const block of definition.blocks) {
      labels.set(scopedName(definition.name, block.label), {
        segmentKind: XexeCodeSegment,
        segmentOffset: pos,
      })

      for (const instr of block.instrs) {
        if (instr.op === "label") {
          let message =
            "(label ...) cannot be an instruction; labels are defined by blocks"
          throw new Error(message)
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
              relocs.push({
                type: relocInfo.type,
                name: resolvedName,
                segmentKind: XexeCodeSegment,
                segmentOffset: instrPos + encodedDispOffset(enc),
              })
            } else if (
              relocInfo.holeKind === "imm64" &&
              enc.immediate !== null &&
              enc.immediate.value === 0n
            ) {
              relocs.push({
                type: relocInfo.type,
                name: resolvedName,
                segmentKind: XexeCodeSegment,
                segmentOffset: instrPos + encodedImmOffset(enc),
              })
            }
            instrPos += encodedSize(enc)
          }
        }

        pos += size
      }
    }
  }

  const buf = new Uint8Array(pos)
  pos = 0

  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue

    pos = (pos + 7) & ~7

    for (const block of definition.blocks) {
      for (const instr of block.instrs) {
        for (const enc of encode(instr)) {
          pos = emitTo(enc, buf, pos)
        }
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

function emitXexeData(
  mod: Mod,
  labels: Map<string, LabelInfo>,
  relocs: Array<XexeRelocationEntry>,
): Uint8Array {
  let anonCounter = maxAnonIndex(mod) + 1

  let totalSize = 0
  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "DataDefinition") continue
    const dataType = inferDataType(mod, definition.value)
    totalSize += computeTreeSize(mod, dataType, definition.value)
  }

  const buf = new Uint8Array(totalSize)
  let pos = 0

  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "DataDefinition") continue

    const dataType = inferDataType(mod, definition.value)

    labels.set(definition.name, {
      segmentKind: XexeDataSegment,
      segmentOffset: pos,
    })

    const deferred: Array<DeferredItem> = []

    pos = emitTree(mod, dataType, definition.value, buf, pos, relocs, deferred)

    while (deferred.length > 0) {
      const d = deferred.shift()!
      const targetStart = pos
      pos = d.emit(pos)
      const anonName = `\xa9data.${anonCounter++}`
      labels.set(anonName, {
        segmentKind: XexeDataSegment,
        segmentOffset: targetStart,
      })
      relocs.push({
        type: "label-abs64",
        name: anonName,
        segmentKind: XexeDataSegment,
        segmentOffset: d.pointerSlotOffset,
      })
    }
  }

  return buf
}

function maxAnonIndex(mod: Mod): number {
  let max = -1
  for (const name of mod.definitions.keys()) {
    const m = name.match(/^\xa9data\.(\d+)$/)
    if (m) {
      const n = parseInt(m[1])
      if (n > max) max = n
    }
  }
  return max
}

function computeTreeSize(mod: Mod, dataType: Type, value: Data): number {
  if (value.kind === "IntData") return typeSize(mod, dataType)

  if (value.kind === "StructData") {
    const fieldTypes = dataTypeUnfold(mod, dataType, S.zeroLocation("data"))
    let total = 0
    for (const [name, data] of Object.entries(value.fields)) {
      const ft = fieldTypes.get(name)
      if (!ft) {
        let message = `unknown field: ${name}`
        throw new Error(message)
      }
      total += computeTreeSize(mod, ft, data)
    }
    return total
  }

  if (value.kind === "AddressData") return 8

  if (value.kind === "PointerData") {
    const inner = computePointerTargetSize(mod, value.target)
    return 8 + inner
  }

  if (value.kind === "StringData") {
    if (typeSize(mod, dataType) === 8) {
      return 8 + value.content.length + 1
    }
    return value.content.length + 1
  }

  if (value.kind === "ArrayData") return typeSize(mod, dataType)

  let message = `unsupported data value`
  throw new Error(message)
}

function computePointerTargetSize(mod: Mod, target: Data): number {
  if (target.kind === "StructData") {
    return computeTreeSize(
      mod,
      structDataType(mod, target.name, S.zeroLocation("data")),
      target,
    )
  }
  if (target.kind === "StringData") return target.content.length + 1
  let message = `unsupported pointer target: ${target.kind}`
  throw new Error(message)
}

function emitTree(
  mod: Mod,
  dataType: Type,
  value: Data,
  buf: Uint8Array,
  offset: number,
  relocs: Array<XexeRelocationEntry>,
  deferred: Array<DeferredItem>,
): number {
  if (value.kind === "IntData") {
    return writeIntLE(buf, offset, typeSize(mod, dataType), value.content)
  }

  if (value.kind === "StructData") {
    const fieldTypes = dataTypeUnfold(mod, dataType, S.zeroLocation("data"))
    let pos = offset
    for (const [name, data] of Object.entries(value.fields)) {
      const ft = fieldTypes.get(name)
      if (!ft) {
        let message = `unknown field: ${name}`
        throw new Error(message)
      }
      pos = emitTree(mod, ft, data, buf, pos, relocs, deferred)
    }
    return pos
  }

  if (value.kind === "AddressData") {
    writeInt64(buf, offset, 0n)
    relocs.push({
      type: "label-abs64",
      name: value.name,
      segmentKind: XexeDataSegment,
      segmentOffset: offset,
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
        emitPointerTarget(mod, value.target, buf, start, relocs, deferred),
    })
    return offset
  }

  if (value.kind === "StringData") {
    if (typeSize(mod, dataType) === 8) {
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
    const elemSize = typeSize(mod, dataType.element)
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
  mod: Mod,
  name: string,
  location: S.SourceLocation,
): Type {
  lookupStructDefinition(mod, name, location)
  return NamedType(name)
}

function emitPointerTarget(
  mod: Mod,
  target: Data,
  buf: Uint8Array,
  offset: number,
  relocs: Array<XexeRelocationEntry>,
  deferred: Array<DeferredItem>,
): number {
  if (target.kind === "StructData") {
    return emitTree(
      mod,
      structDataType(mod, target.name, S.zeroLocation("emitPointerTarget")),
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
