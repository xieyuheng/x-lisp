import {
  type Xexe,
  type XexeLabelEntry,
  type XexeRelocationEntry,
} from "./types.ts"

const MAGIC = new TextEncoder().encode("xexe\0\0\0\0")
const MACHINE = new TextEncoder().encode("x86-64\0\0")

const HEADER_SIZE = 120
const LABEL_ENTRY_SIZE = 24
const RELOCATION_ENTRY_SIZE = 32

export function emitXexe(xexe: Xexe): Uint8Array {
  const stringNames = collectStringNames(xexe)
  const strtab = buildStringTable(stringNames)
  const strtabOffsets = buildStringOffsets(stringNames)

  const codeFileOffset = HEADER_SIZE
  const dataFileOffset = codeFileOffset + xexe.code.byteLength
  const stringTableFileOffset = dataFileOffset + xexe.data.byteLength
  const stringTableSize = strtab.byteLength
  const labelTableFileOffset = stringTableFileOffset + stringTableSize
  const labelTableSize = xexe.labelTable.length * LABEL_ENTRY_SIZE
  const relocationTableFileOffset = labelTableFileOffset + labelTableSize
  const relocationTableSize =
    xexe.relocationTable.length * RELOCATION_ENTRY_SIZE

  const totalSize = relocationTableFileOffset + relocationTableSize
  const buf = new Uint8Array(totalSize)

  emitHeader(buf, xexe, {
    codeFileOffset,
    dataFileOffset,
    stringTableFileOffset,
    stringTableSize,
    labelTableFileOffset,
    labelTableSize,
    relocationTableFileOffset,
    relocationTableSize,
  })

  buf.set(xexe.code, codeFileOffset)
  buf.set(xexe.data, dataFileOffset)
  buf.set(strtab, stringTableFileOffset)
  emitLabelTable(buf, labelTableFileOffset, xexe.labelTable, strtabOffsets)
  emitRelocationTable(
    buf,
    relocationTableFileOffset,
    xexe.relocationTable,
    strtabOffsets,
  )

  return buf
}

function emitHeader(
  buf: Uint8Array,
  xexe: Xexe,
  offsets: {
    codeFileOffset: number
    dataFileOffset: number
    stringTableFileOffset: number
    stringTableSize: number
    labelTableFileOffset: number
    labelTableSize: number
    relocationTableFileOffset: number
    relocationTableSize: number
  },
): void {
  let pos = 0
  buf.set(MAGIC, pos)
  pos += 8
  buf.set(MACHINE, pos)
  pos += 8

  writeU64LE(buf, pos, 0n)
  pos += 8

  writeU64LE(buf, pos, BigInt(offsets.codeFileOffset))
  pos += 8
  writeU64LE(buf, pos, BigInt(xexe.code.byteLength))
  pos += 8
  writeU64LE(buf, pos, BigInt(xexe.entryCodeSegmentOffset))
  pos += 8

  writeU64LE(buf, pos, BigInt(offsets.dataFileOffset))
  pos += 8
  writeU64LE(buf, pos, BigInt(xexe.data.byteLength))
  pos += 8

  writeU64LE(buf, pos, BigInt(xexe.spaceSize))
  pos += 8

  writeU64LE(buf, pos, BigInt(offsets.stringTableFileOffset))
  pos += 8
  writeU64LE(buf, pos, BigInt(offsets.stringTableSize))
  pos += 8

  writeU64LE(buf, pos, BigInt(offsets.labelTableFileOffset))
  pos += 8
  writeU64LE(buf, pos, BigInt(offsets.labelTableSize))
  pos += 8

  writeU64LE(buf, pos, BigInt(offsets.relocationTableFileOffset))
  pos += 8
  writeU64LE(buf, pos, BigInt(offsets.relocationTableSize))
}

function collectStringNames(xexe: Xexe): string[] {
  const names: string[] = []
  for (const entry of xexe.labelTable) {
    names.push(entry.name)
  }
  for (const entry of xexe.relocationTable) {
    names.push(entry.type)
    names.push(entry.name)
  }
  return [...new Set(names)]
}

function buildStringTable(names: string[]): Uint8Array {
  const encoder = new TextEncoder()
  let totalLen = 0
  for (const name of names) {
    totalLen += encoder.encode(name).byteLength + 1
  }
  const buf = new Uint8Array(totalLen)
  let pos = 0
  for (const name of names) {
    const encoded = encoder.encode(name)
    buf.set(encoded, pos)
    buf[pos + encoded.byteLength] = 0
    pos += encoded.byteLength + 1
  }
  return buf
}

function buildStringOffsets(names: string[]): Map<string, number> {
  const encoder = new TextEncoder()
  const offsets = new Map<string, number>()
  let totalLen = 0
  for (const name of names) {
    offsets.set(name, totalLen)
    totalLen += encoder.encode(name).byteLength + 1
  }
  return offsets
}

function emitLabelTable(
  buf: Uint8Array,
  start: number,
  entries: Array<XexeLabelEntry>,
  strtabOffsets: Map<string, number>,
): void {
  let pos = start
  for (const entry of entries) {
    const nameOff = strtabOffsets.get(entry.name) ?? 0
    writeU64LE(buf, pos, BigInt(nameOff))
    pos += 8
    writeU64LE(buf, pos, BigInt(entry.segmentKind))
    pos += 8
    writeU64LE(buf, pos, BigInt(entry.segmentOffset))
    pos += 8
  }
}

function emitRelocationTable(
  buf: Uint8Array,
  start: number,
  entries: Array<XexeRelocationEntry>,
  strtabOffsets: Map<string, number>,
): void {
  let pos = start
  for (const entry of entries) {
    const typeOff = strtabOffsets.get(entry.type) ?? 0
    const nameOff = strtabOffsets.get(entry.name) ?? 0
    writeU64LE(buf, pos, BigInt(typeOff))
    pos += 8
    writeU64LE(buf, pos, BigInt(nameOff))
    pos += 8
    writeU64LE(buf, pos, BigInt(entry.segmentKind))
    pos += 8
    writeU64LE(buf, pos, BigInt(entry.segmentOffset))
    pos += 8
  }
}

function writeU64LE(buf: Uint8Array, offset: number, value: bigint): void {
  for (let i = 0; i < 8; i++) {
    buf[offset + i] = Number((value >> BigInt(i * 8)) & 0xffn)
  }
}
