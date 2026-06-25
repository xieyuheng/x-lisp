import * as S from "@xieyuheng/sexp.js"
import { emitTo, encode } from "../encode/index.ts"
import { emptyEnv, evaluate } from "../evaluate/index.ts"
import type { Mod, ValueRelocation } from "../mod/index.ts"
import {
  collectCodeLayout,
  collectMetadataSlots,
  computePathOffset,
  emitDataSection,
  writeInt32LE,
  writeInt64,
  writeU32LE,
  type EmittedData,
  type ExternalReloc,
  type InternalReloc,
  type MetadataSlots,
  type Relocation,
} from "./layout.ts"

const MAGIC: Uint8Array = new Uint8Array([0x58, 0x38, 0x36, 0x00])
const PAGE_SIZE = 4096
const ALIGN_8 = 8

function pageAlign(size: number): number {
  return (size + PAGE_SIZE - 1) & ~(PAGE_SIZE - 1)
}

export function assembleExe(mod: Mod): Uint8Array {
  const labels = new Map<string, number>()
  const codeRelocs: Array<Relocation> = []
  const externalRelocs: Array<ExternalReloc> = []

  const codeSize = collectCodeLayout(
    mod,
    labels,
    codeRelocs,
    true,
    externalRelocs,
  )
  const codeRegion = pageAlign(codeSize)

  const dataResult: EmittedData = emitDataSection(mod, labels, codeRegion)
  let dataSize = dataResult.bytes.length

  for (const reloc of dataResult.relocs) {
    reloc.patchOffset += codeRegion
    reloc.targetOffset += codeRegion
  }

  for (const addressReloc of dataResult.addressRelocs) {
    addressReloc.patchOffset += codeRegion
  }

  // Add value reloc 8-byte slots to data section
  const valueRelocationEntries: Array<ValueRelocation> = [
    ...mod.valueRelocations.values(),
  ]
  const valueRelocationDataStart = dataSize
  dataSize += valueRelocationEntries.length * 8

  // Record value relocation labels (must precede address reloc resolution)
  for (let i = 0; i < valueRelocationEntries.length; i++) {
    const valueRelocation = valueRelocationEntries[i]
    labels.set(
      valueRelocation.name,
      codeRegion + valueRelocationDataStart + i * 8,
    )
  }

  const metadataSlots: MetadataSlots = collectMetadataSlots(mod)

  const internalRelocs: Array<InternalReloc> = buildInternalRelocs(
    mod,
    labels,
    dataResult.relocs,
    metadataSlots,
  )

  for (const addressReloc of dataResult.addressRelocs) {
    const base = labels.get(addressReloc.labelName)
    if (base === undefined) {
      let message = `undefined address label: ${addressReloc.labelName}`
      throw new Error(message)
    }
    const targetOffset =
      base + computePathOffset(mod, addressReloc.labelName, addressReloc.path)
    internalRelocs.push({
      patchOffset: addressReloc.patchOffset,
      targetOffset,
    })
  }

  let spaceSize = 0
  for (const definition of mod.definitions.values()) {
    if (definition.kind === "SpaceDefinition") {
      const value = evaluate(mod, emptyEnv(), definition.size)
      if (value.kind !== "IntValue") {
        let message = `define-space size must be integer, got: ${value.kind}`
        throw new S.ErrorWithSourceLocation(message, definition.location)
      }
      spaceSize += Number(value.value)
    }
  }

  const { strtab, strtabOffsets } = buildStringTable(
    externalRelocs,
    mod,
    valueRelocationEntries,
  )

  const externalRelocCount = externalRelocs.length
  const externalRelocTableSize = externalRelocCount * 8
  const valueRelocationCount = valueRelocationEntries.length
  const valueRelocationTableSize = valueRelocationCount * 12
  const stringTableSize = strtab.byteLength
  const nativeFnTableSize = 8 + countCodeDefs(mod) * 8
  const relocTableSize =
    internalRelocs.length * 8 +
    externalRelocTableSize +
    valueRelocationTableSize +
    stringTableSize +
    nativeFnTableSize
  const fileSize = 64 + codeSize + dataSize + relocTableSize
  const buf = new Uint8Array(fileSize)
  buf.set(MAGIC, 0)

  writeU32LE(buf, 0x04, 0)
  writeU32LE(buf, 0x08, codeSize)
  writeU32LE(buf, 0x0c, dataSize)
  writeU32LE(buf, 0x10, spaceSize)
  writeU32LE(buf, 0x14, internalRelocs.length)
  writeU32LE(buf, 0x18, externalRelocCount)
  writeU32LE(buf, 0x1c, computeEntryOffset(mod))
  writeU32LE(buf, 0x20, valueRelocationCount)

  let pos = 64
  pos = emitCodeSection(mod, buf, pos)

  // Write data section (original + value relocation zero slots)
  const dataBuf = new Uint8Array(dataSize)
  dataBuf.set(dataResult.bytes)
  buf.set(dataBuf, pos)
  pos += dataSize

  for (const reloc of internalRelocs) {
    writeU32LE(buf, pos, reloc.patchOffset)
    writeU32LE(buf, pos + 4, reloc.targetOffset)
    pos += 8
  }

  for (const reloc of externalRelocs) {
    const strOffset = strtabOffsets.get(reloc.symbolName) ?? 0
    writeU32LE(buf, pos, reloc.patchOffset)
    writeU32LE(buf, pos + 4, strOffset)
    pos += 8
  }

  let valueRelocationIndex = 0
  for (const valueRelocation of valueRelocationEntries) {
    const classOff = strtabOffsets.get(valueRelocation.className) ?? 0
    const argOff = strtabOffsets.get(valueRelocation.arg) ?? 0
    writeU32LE(
      buf,
      pos,
      codeRegion + valueRelocationDataStart + valueRelocationIndex * 8,
    )
    writeU32LE(buf, pos + 4, classOff)
    writeU32LE(buf, pos + 8, argOff)
    pos += 12
    valueRelocationIndex++
  }

  pos = emitNativeFnHeader(
    stringTableSize,
    mod,
    labels,
    strtabOffsets,
    buf,
    pos,
  )

  buf.set(strtab, pos)
  pos += stringTableSize

  pos = emitNativeFnEntries(mod, labels, strtabOffsets, buf, pos)

  for (const reloc of codeRelocs) {
    let target = labels.get(reloc.labelName)
    if (target === undefined) {
      let message = `undefined label: ${reloc.labelName}`
      throw new Error(message)
    }
    target += computePathOffset(mod, reloc.labelName, reloc.labelPath)
    const disp = target - reloc.instrEndPos
    writeInt32LE(buf, 64 + reloc.fieldOffset, disp)
  }

  return buf
}

function buildStringTable(
  relocs: Array<ExternalReloc>,
  mod: Mod,
  valueRelocations: Array<ValueRelocation>,
): { strtab: Uint8Array; strtabOffsets: Map<string, number> } {
  const names: string[] = relocs.map((r) => r.symbolName)
  for (const definition of mod.definitions.values()) {
    if (definition.kind === "CodeDefinition") names.push(definition.name)
  }
  for (const vr of valueRelocations) {
    names.push(vr.className)
    names.push(vr.arg)
  }
  const uniqueNames = [...new Set(names)]
  const encoder = new TextEncoder()
  const offsets = new Map<string, number>()
  let totalLen = 0
  for (const name of uniqueNames) {
    offsets.set(name, totalLen)
    totalLen += encoder.encode(name).byteLength + 1
  }
  const buf = new Uint8Array(totalLen)
  let pos = 0
  for (const name of uniqueNames) {
    const encoded = encoder.encode(name)
    buf.set(encoded, pos)
    buf[pos + encoded.byteLength] = 0
    pos += encoded.byteLength + 1
  }
  return { strtab: buf, strtabOffsets: offsets }
}

function countCodeDefs(mod: Mod): number {
  let count = 0
  for (const definition of mod.definitions.values()) {
    if (definition.kind === "CodeDefinition") count++
  }
  return count
}

function emitNativeFnHeader(
  strtabSize: number,
  mod: Mod,
  labels: Map<string, number>,
  strtabOffsets: Map<string, number>,
  buf: Uint8Array,
  start: number,
): number {
  const count = countCodeDefs(mod)
  writeU32LE(buf, start, strtabSize)
  writeU32LE(buf, start + 4, count)
  return start + 8
}

function emitNativeFnEntries(
  mod: Mod,
  labels: Map<string, number>,
  strtabOffsets: Map<string, number>,
  buf: Uint8Array,
  start: number,
): number {
  const entries: Array<{ name: string; codeOffset: number }> = []
  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue
    const codeOffset = labels.get(definition.name)
    if (codeOffset === undefined) continue
    entries.push({ name: definition.name, codeOffset })
  }

  let pos = start
  for (const entry of entries) {
    const nameOff = strtabOffsets.get(entry.name) ?? 0
    writeU32LE(buf, pos, nameOff)
    writeU32LE(buf, pos + 4, entry.codeOffset)
    pos += 8
  }
  return pos
}

function emitCodeSection(mod: Mod, buf: Uint8Array, start: number): number {
  let codePos = 0
  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue

    if (mod.metadataDefinitions.has(definition.name)) {
      const placeholderPos = (codePos + ALIGN_8 - 1) & ~(ALIGN_8 - 1)
      while (codePos < placeholderPos) {
        buf[start + codePos] = 0
        codePos++
      }
      writeInt64(buf, start + codePos, 0n)
      codePos += 8
    } else {
      codePos = (codePos + ALIGN_8 - 1) & ~(ALIGN_8 - 1)
    }

    for (const block of definition.blocks) {
      for (const instr of block.instrs) {
        const encodings = encode(instr)
        for (const enc of encodings) {
          codePos = emitTo(enc, buf, start + codePos) - start
        }
      }
    }
  }
  return start + codePos
}

function computeEntryOffset(mod: Mod): number {
  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue
    return mod.metadataDefinitions.has(definition.name) ? 8 : 0
  }
  return 0
}

function buildInternalRelocs(
  mod: Mod,
  labels: Map<string, number>,
  dataRelocs: Array<InternalReloc>,
  metadataSlots: MetadataSlots,
): Array<InternalReloc> {
  const result: Array<InternalReloc> = [...dataRelocs]

  for (const slot of metadataSlots) {
    const metaLabel = `.meta.${slot.codeName}`
    const target = labels.get(metaLabel)
    if (target === undefined) continue
    result.push({
      patchOffset: slot.placeholderOffset,
      targetOffset: target,
    })
  }

  return result
}
