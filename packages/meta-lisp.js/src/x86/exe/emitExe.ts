import { type Exe, type ExeFixupEntry, type ExeLabelEntry } from "./types.ts"

const MAGIC = new TextEncoder().encode("x86\0\0\0\0")

const HEADER_SIZE = 112
const LABEL_ENTRY_SIZE = 24
const FIXUP_ENTRY_SIZE = 40

export function emitExe(exe: Exe): Uint8Array {
  const stringNames = collectStringNames(exe)
  const strtab = buildStringTable(stringNames)
  const strtabOffsets = buildStringOffsets(stringNames)

  const codeFileOffset = HEADER_SIZE
  const dataFileOffset = codeFileOffset + exe.code.byteLength
  const stringTableFileOffset = dataFileOffset + exe.data.byteLength
  const stringTableSize = strtab.byteLength
  const labelTableFileOffset = stringTableFileOffset + stringTableSize
  const labelTableSize = exe.labelTable.length * LABEL_ENTRY_SIZE
  const fixupTableFileOffset = labelTableFileOffset + labelTableSize
  const fixupTableSize = exe.fixupTable.length * FIXUP_ENTRY_SIZE

  const totalSize = fixupTableFileOffset + fixupTableSize
  const buf = new Uint8Array(totalSize)

  emitHeader(buf, exe, {
    codeFileOffset,
    dataFileOffset,
    stringTableFileOffset,
    stringTableSize,
    labelTableFileOffset,
    labelTableSize,
    fixupTableFileOffset,
    fixupTableSize,
  })

  buf.set(exe.code, codeFileOffset)
  buf.set(exe.data, dataFileOffset)
  buf.set(strtab, stringTableFileOffset)
  emitLabelTable(buf, labelTableFileOffset, exe.labelTable, strtabOffsets)
  emitFixupTable(buf, fixupTableFileOffset, exe.fixupTable, strtabOffsets)

  return buf
}

function emitHeader(
  buf: Uint8Array,
  exe: Exe,
  offsets: {
    codeFileOffset: number
    dataFileOffset: number
    stringTableFileOffset: number
    stringTableSize: number
    labelTableFileOffset: number
    labelTableSize: number
    fixupTableFileOffset: number
    fixupTableSize: number
  },
): void {
  let pos = 0
  buf.set(MAGIC, pos)
  pos += 8

  writeU64LE(buf, pos, 0n)
  pos += 8

  writeU64LE(buf, pos, BigInt(offsets.codeFileOffset))
  pos += 8
  writeU64LE(buf, pos, BigInt(exe.code.byteLength))
  pos += 8
  writeU64LE(buf, pos, BigInt(exe.entryCodeSegmentOffset))
  pos += 8

  writeU64LE(buf, pos, BigInt(offsets.dataFileOffset))
  pos += 8
  writeU64LE(buf, pos, BigInt(exe.data.byteLength))
  pos += 8

  writeU64LE(buf, pos, BigInt(exe.spaceSize))
  pos += 8

  writeU64LE(buf, pos, BigInt(offsets.stringTableFileOffset))
  pos += 8
  writeU64LE(buf, pos, BigInt(offsets.stringTableSize))
  pos += 8

  writeU64LE(buf, pos, BigInt(offsets.labelTableFileOffset))
  pos += 8
  writeU64LE(buf, pos, BigInt(offsets.labelTableSize))
  pos += 8

  writeU64LE(buf, pos, BigInt(offsets.fixupTableFileOffset))
  pos += 8
  writeU64LE(buf, pos, BigInt(offsets.fixupTableSize))
}

function collectStringNames(exe: Exe): string[] {
  const names: string[] = []
  for (const entry of exe.labelTable) {
    names.push(entry.name)
  }
  for (const entry of exe.fixupTable) {
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
  entries: Array<ExeLabelEntry>,
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

function emitFixupTable(
  buf: Uint8Array,
  start: number,
  entries: Array<ExeFixupEntry>,
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
    writeU64LE(buf, pos, entry.addend)
    pos += 8
  }
}

function writeU64LE(buf: Uint8Array, offset: number, value: bigint): void {
  for (let i = 0; i < 8; i++) {
    buf[offset + i] = Number((value >> BigInt(i * 8)) & 0xffn)
  }
}
