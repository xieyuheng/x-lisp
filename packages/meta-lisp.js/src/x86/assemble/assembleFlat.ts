import type { Mod } from "../mod/index.ts"
import type { CodeDefinition } from "../definition/index.ts"
import type { Instr } from "../instr/index.ts"
import type { Block } from "../block/index.ts"
import { encode, encodedSize, emitTo } from "../encode/index.ts"
import type { EncodedInstruction } from "../encode/index.ts"

type Relocation = {
  labelName: string
  instrEndPos: number
  fieldOffset: number
}

type FlatInstr = {
  instr: Instr
  encodings: Array<EncodedInstruction>
  size: number
}

export function assembleFlat(mod: Mod): Uint8Array {
  const codeDefs = collectCodeDefinitions(mod)

  const flatInstrs: Array<FlatInstr> = []
  const labels = new Map<string, number>()
  const relocations: Array<Relocation> = []

  let pos = 0
  for (const def of codeDefs) {
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

        flatInstrs.push({ instr, encodings, size })

        const labelName = extractLabelName(instr)
        if (labelName) {
          for (const enc of encodings) {
            if (enc.displacement !== null && enc.displacement.value === 0) {
              const dispOffset = encodedDispOffset(enc)
              relocations.push({
                labelName,
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

  const buf = new Uint8Array(pos)
  pos = 0
  for (const fi of flatInstrs) {
    for (const enc of fi.encodings) {
      pos = emitTo(enc, buf, pos)
    }
  }

  for (const reloc of relocations) {
    const target = labels.get(reloc.labelName)
    if (target === undefined) {
      throw new Error(`undefined label: ${reloc.labelName}`)
    }
    const disp = target - reloc.instrEndPos
    writeInt32LE(buf, reloc.fieldOffset, disp)
  }

  return buf
}

function collectCodeDefinitions(mod: Mod): Array<CodeDefinition> {
  const result: Array<CodeDefinition> = []
  for (const def of mod.definitions.values()) {
    if (def.kind === "CodeDefinition") {
      result.push(def)
    }
  }
  return result
}

function extractLabelName(instr: Instr): string | null {
  for (const op of instr.operands) {
    if (op.kind === "LabelOperand") {
      return op.name
    }
    if (op.kind === "LabelImmOperand") {
      return op.label.name
    }
    if (op.kind === "LabelDerefOperand") {
      return op.label.name
    }
  }
  return null
}

function encodedDispOffset(enc: EncodedInstruction): number {
  let offset = enc.prefixes.length
  if (enc.rex !== null) offset += 1
  offset += enc.opcode.length
  if (enc.modRM !== null) offset += 1
  if (enc.sib !== null) offset += 1
  return offset
}

function writeInt32LE(buf: Uint8Array, offset: number, value: number): void {
  buf[offset] = value & 0xff
  buf[offset + 1] = (value >> 8) & 0xff
  buf[offset + 2] = (value >> 16) & 0xff
  buf[offset + 3] = (value >> 24) & 0xff
}
