import { emitTo, encode } from "../encode/index.ts"
import type { Mod } from "../mod/index.ts"
import {
  collectCodeLayout,
  collectDataLayout,
  computePathOffset,
  type Relocation,
  writeInt32LE,
} from "./layout.ts"

export function assembleFlat(mod: Mod): Uint8Array {
  const labels = new Map<string, number>()
  const relocations: Array<Relocation> = []

  const codeSize = collectCodeLayout(mod, labels, relocations)
  const dataLayouts = collectDataLayout(mod, labels, codeSize)

  const totalSize =
    codeSize + dataLayouts.reduce((s, d) => s + d.bytes.length, 0)
  const buf = new Uint8Array(totalSize)

  let pos = 0
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
    writeInt32LE(buf, reloc.fieldOffset, disp)
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
