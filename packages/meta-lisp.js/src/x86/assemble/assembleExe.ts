import { emitTo, encode, encodedSize } from "../encode/index.ts"
import { emptyEnv, evaluate } from "../evaluate/index.ts"
import type { Mod } from "../mod/index.ts"
import {
  collectCodeLayout,
  computePathOffset,
  emitDataSection,
  type Relocation,
  type InternalReloc,
  type MetadataSlots,
  type EmittedData,
  collectMetadataSlots,
  writeInt32LE,
  writeInt64,
  writeU32LE,
} from "./layout.ts"

const MAGIC: Uint8Array = new Uint8Array([0x58, 0x38, 0x36, 0x00])
const PAGE_SIZE = 4096
const ALIGN_16 = 16

function pageAlign(size: number): number {
  return (size + PAGE_SIZE - 1) & ~(PAGE_SIZE - 1)
}

export function assembleExe(mod: Mod): Uint8Array {
  const labels = new Map<string, number>()
  const codeRelocs: Array<Relocation> = []

  const codeSize = collectCodeLayout(mod, labels, codeRelocs, true)
  const codeRegion = pageAlign(codeSize)

  const dataResult: EmittedData = emitDataSection(mod, labels, codeRegion)
  const dataSize = dataResult.bytes.length

  for (const reloc of dataResult.relocs) {
    reloc.patchOffset += codeRegion
    reloc.targetOffset += codeRegion
  }

  const metadataSlots: MetadataSlots = collectMetadataSlots(mod)

  const internalRelocs: Array<InternalReloc> = buildInternalRelocs(
    mod, labels, dataResult.relocs, metadataSlots,
  )

  let spaceSize = 0
  for (const def of mod.definitions.values()) {
    if (def.kind === "SpaceDefinition") {
      const value = evaluate(mod, emptyEnv(), def.size)
      if (value.kind !== "IntValue") {
        throw new Error(`define-space size must be integer, got: ${value.kind}`)
      }
      spaceSize += Number(value.value)
    }
  }

  const relocTableSize = internalRelocs.length * 8
  const fileSize = 64 + codeSize + dataSize + relocTableSize
  const buf = new Uint8Array(fileSize)
  buf.set(MAGIC, 0)

  writeU32LE(buf, 0x04, 0)
  writeU32LE(buf, 0x08, codeSize)
  writeU32LE(buf, 0x0c, dataSize)
  writeU32LE(buf, 0x10, spaceSize)
  writeU32LE(buf, 0x14, internalRelocs.length)
  writeU32LE(buf, 0x18, 0)
  writeU32LE(buf, 0x1c, computeEntryOffset(mod))

  let pos = 64
  pos = emitCodeSection(mod, buf, pos)

  buf.set(dataResult.bytes, pos)
  pos += dataSize

  for (const reloc of internalRelocs) {
    writeU32LE(buf, pos, reloc.patchOffset)
    writeU32LE(buf, pos + 4, reloc.targetOffset)
    pos += 8
  }

  for (const reloc of codeRelocs) {
    let target = labels.get(reloc.labelName)
    if (target === undefined) {
      throw new Error(`undefined label: ${reloc.labelName}`)
    }
    target += computePathOffset(mod, reloc.labelName, reloc.labelPath)
    const disp = target - reloc.instrEndPos
    writeInt32LE(buf, 64 + reloc.fieldOffset, disp)
  }

  return buf
}

function emitCodeSection(mod: Mod, buf: Uint8Array, start: number): number {
  let codePos = 0
  for (const def of mod.definitions.values()) {
    if (def.kind !== "CodeDefinition") continue

    let targetEntry = (codePos + ALIGN_16 - 1) & ~(ALIGN_16 - 1)
    if (targetEntry < 16) targetEntry = 16

    const placeholderPos = targetEntry - 8
    while (codePos < placeholderPos) {
      buf[start + codePos] = 0
      codePos++
    }

    writeInt64(buf, start + codePos, 0n)
    codePos += 8

    while (codePos < targetEntry) {
      buf[start + codePos] = 0
      codePos++
    }

    for (const block of def.blocks) {
      for (const instr of block.instrs) {
        if (instr.op === "label") continue
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
  for (const def of mod.definitions.values()) {
    if (def.kind !== "CodeDefinition") continue
    return 16
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
