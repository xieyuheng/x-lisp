import { emitTo, encode } from "../encode/index.ts"
import { emptyEnv, evaluate } from "../evaluate/index.ts"
import type { Mod } from "../mod/index.ts"
import {
  collectCodeLayout,
  collectDataLayout,
  computePathOffset,
  type Relocation,
  writeInt32LE,
} from "./layout.ts"

const MAGIC: Uint8Array = new Uint8Array([0x58, 0x38, 0x36, 0x00])
const PAGE_SIZE = 4096

function pageAlign(size: number): number {
  return (size + PAGE_SIZE - 1) & ~(PAGE_SIZE - 1)
}

export function assembleExe(mod: Mod): Uint8Array {
  const labels = new Map<string, number>()
  const relocations: Array<Relocation> = []

  const codeSize = collectCodeLayout(mod, labels, relocations)
  const codeRegion = pageAlign(codeSize)

  const dataLayouts = collectDataLayout(mod, labels, codeRegion)
  const dataSize = dataLayouts.reduce((s, d) => s + d.bytes.length, 0)

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

  const fileSize = 64 + codeSize + dataSize
  const buf = new Uint8Array(fileSize)
  buf.set(MAGIC, 0)

  writeU32LE(buf, 0x04, 0)
  writeU32LE(buf, 0x08, codeSize)
  writeU32LE(buf, 0x0c, dataSize)
  writeU32LE(buf, 0x10, spaceSize)
  writeU32LE(buf, 0x14, 0)
  writeU32LE(buf, 0x18, 0)
  writeU32LE(buf, 0x1c, 0)

  let pos = 64
  pos = emitCodeSection(mod, buf, pos)

  for (const dl of dataLayouts) {
    buf.set(dl.bytes, pos)
    pos += dl.bytes.length
  }

  for (const reloc of relocations) {
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
  let pos = start
  for (const def of mod.definitions.values()) {
    if (def.kind !== "CodeDefinition") continue
    for (const block of def.blocks) {
      for (const instr of block.instrs) {
        if (instr.op === "label") continue
        const encodings = encode(instr)
        for (const enc of encodings) {
          pos = emitTo(enc, buf, pos)
        }
      }
    }
  }
  return pos
}

function writeU32LE(buf: Uint8Array, offset: number, value: number): void {
  buf[offset] = value & 0xff
  buf[offset + 1] = (value >> 8) & 0xff
  buf[offset + 2] = (value >> 16) & 0xff
  buf[offset + 3] = (value >> 24) & 0xff
}
