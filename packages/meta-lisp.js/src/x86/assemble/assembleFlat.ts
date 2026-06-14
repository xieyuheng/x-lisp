import { emitTo, encode } from "../encode/index.ts"
import type { Mod } from "../mod/index.ts"
import {
  collectCodeLayout,
  computePathOffset,
  emitDataSection,
  type Relocation,
  writeInt32LE,
} from "./layout.ts"

export function assembleFlat(mod: Mod): Uint8Array {
  const labels = new Map<string, number>()
  const relocations: Array<Relocation> = []

  const codeSize = collectCodeLayout(mod, labels, relocations)
  const dataResult = emitDataSection(mod, labels, codeSize)

  if (dataResult.relocs.length > 0) {
    let message =
      "flat mode does not support pointer-t / string-t fields (use assemble-x86-exe)"
    throw new Error(message)
  }

  const totalSize = codeSize + dataResult.bytes.length
  const buf = new Uint8Array(totalSize)

  let pos = 0
  pos = emitCodeSection(mod, buf, pos)

  buf.set(dataResult.bytes, pos)

  for (const reloc of relocations) {
    let target = labels.get(reloc.labelName)
    if (target === undefined) {
      let message = `undefined label: ${reloc.labelName}`
      throw new Error(message)
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
