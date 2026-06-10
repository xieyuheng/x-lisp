import type { Mod } from "../../mod/index.ts"
import type { Definition, CodeDefinition, DataDefinition, MetadataDefinition, StructDefinition, SpaceDefinition } from "../../definition/index.ts"
import type { Value, Type } from "../../index.ts"
import { typeBytes } from "../../type/Type.ts"
import { WriteBuffer } from "../buffer/WriteBuffer.ts"
import { encodeInstr, type EncodedResult } from "../encode/encodeInstr.ts"
import type { RelocEntry } from "../encode/x86/encode.ts"

const XEXE_NEXT_MAGIC = 0x5845584e
const XEXE_NEXT_VERSION = 1

const RELOC_ABS64 = 0
const RELOC_REL32 = 1
const SYM_DEFINED = 0
const SYM_EXTERNAL = 1

type LabelOffsets = Map<string, number>
type SymbolInfo = { nameOff: number; flags: number; valueOff: number }
type FuncEntry = { codeStart: number; codeEnd: number; metadataOff: number }

export function writeXexe(mod: Mod): ArrayBuffer {
  const w = new WriteBuffer()
  const strings = new Map<string, number>()
  strings.set("", 0) // null terminator at offset 0

  const symbols = new Map<string, SymbolInfo>()
  const funcEntries: Array<FuncEntry> = []
  const relocs: Array<{ rva: number; type: number; symbolName: string; addend: number }> = []

  const structSizes = buildStructSizes(mod)

  // --- collect strings ---
  function intern(s: string): number {
    const existing = strings.get(s)
    if (existing !== undefined) return existing
    const off = w.getSize() // placeholder - will be filled at string table write time
    strings.set(s, 0) // temporary
    return 0 // will be resolved later
  }

  // --- compute data section layout (first pass: compute sizes) ---
  let dataSize = 0
  const dataLabelOffsets = new Map<string, number>()
  const dataLayouts: Array<{ def: DataDefinition | MetadataDefinition; offset: number }> = []
  const spaceLayouts: Array<{ def: SpaceDefinition; offset: number }> = []

  for (const [name, def] of mod.definitions) {
    if (def.kind === "DataDefinition") {
      dataLabelOffsets.set(name, dataSize)
      const size = computeValueSize(def.fields, mod.dataTypes.get(name)!, structSizes)
      dataLayouts.push({ def, offset: dataSize })
      dataSize += size
    } else if (def.kind === "MetadataDefinition") {
      const type = mod.codeMetadataType
      let size = 0
      if (type) {
        size = computeValueSize(def.fields, type, structSizes)
      }
      dataLabelOffsets.set(def.target + "/metadata", dataSize)
      dataLayouts.push({ def, offset: dataSize })
      dataSize += size
    } else if (def.kind === "SpaceDefinition") {
      dataLabelOffsets.set(name, dataSize)
      spaceLayouts.push({ def, offset: dataSize })
      dataSize += Number(def.size)
    }
  }

  // --- compute code section layout ---
  const codeLabelOffsets = new Map<string, number>()
  let codeSize = 0

  for (const [name, def] of mod.definitions) {
    if (def.kind !== "CodeDefinition") continue

    // -8 slot
    codeSize += 8
    codeLabelOffsets.set(name, codeSize)

    for (const block of def.blocks) {
      codeLabelOffsets.set(block.name, codeSize)
      for (const instr of block.instrs) {
        const result = encodeInstr(instr)
        codeSize += result.bytes.length
        for (const [label, _off] of result.labels) {
          codeLabelOffsets.set(label, codeSize)
        }
      }
    }
  }

  // pad code section to 16-byte alignment
  const codePadding = (16 - (codeSize % 16)) % 16
  codeSize += codePadding

  // --- build string table (now we know the real offsets) ---
  const stringOffsets = new Map<string, number>()
  stringOffsets.set("", 0)
  let stringSize = 1 // null at offset 0
  for (const [s] of strings) {
    if (s === "") continue
    stringOffsets.set(s, stringSize)
    stringSize += s.length + 1
  }

  function stringOff(s: string): number {
    const off = stringOffsets.get(s)
    if (off === undefined) throw new Error(`string not interned: ${s}`)
    return off
  }

  // --- build symbols ---
  for (const [name, off] of codeLabelOffsets) {
    symbols.set(name, { nameOff: stringOff(name), flags: SYM_DEFINED, valueOff: off + codeSectionOffset() })
  }
  for (const [name, off] of dataLabelOffsets) {
    symbols.set(name, { nameOff: stringOff(name), flags: SYM_DEFINED, valueOff: off + dataSectionOffset() })
  }

  // collect external symbols from relocations
  const pendingRelocs: Array<{
    rva: number; type: number; symbolName: string; addend: number
  }> = []

  // --- encode code section ---
  const codeBytes: number[] = []
  const codeRelocs: Array<{ codeOffset: number; reloc: RelocEntry }> = []

  for (const [name, def] of mod.definitions) {
    if (def.kind !== "CodeDefinition") continue

    // -8 slot: write metadata offset (will be resolved to ABS64 reloc)
    const metaOff = getMetadataOffset(name, dataLabelOffsets)
    const metaSymbol = name + "/metadata"
    codeRelocs.push({
      codeOffset: 8 * funcEntries.length, // -8 slot is before entry
      reloc: { offset: 0, kind: "ABS64", label: { name: metaSymbol, path: [], addend: 0 } },
    })

    const codeStart = codeBytes.length + 8 // skip -8 slot
    // write placeholder for -8 slot
    for (let i = 0; i < 8; i++) codeBytes.push(0)

    let blockEnd = codeStart
    for (const block of def.blocks) {
      for (const instr of block.instrs) {
        const result = encodeInstr(instr)
        const instrStart = codeBytes.length
        for (const b of result.bytes) codeBytes.push(b)
        for (const reloc of result.relocs) {
          codeRelocs.push({ codeOffset: instrStart + reloc.offset, reloc })
        }
      }
      blockEnd = codeBytes.length
    }

    funcEntries.push({
      codeStart: codeSectionOffset() + codeStart,
      codeEnd: codeSectionOffset() + blockEnd,
      metadataOff: dataSectionOffset() + (dataLabelOffsets.get(name + "/metadata") || 0),
    })
  }

  // code padding
  for (let i = 0; i < codePadding; i++) codeBytes.push(0)

  // --- compute section offsets ---
  const headerSize = 64
  const funcTableOff = headerSize
  const funcTableSize = funcEntries.length * 12
  const codeOff = funcTableOff + funcTableSize
  const dataOff = codeOff + codeSize
  const relocCount = codeRelocs.length + pendingRelocs.length
  const relocOff = dataOff + dataSize
  const relocTableSize = relocCount * 12
  const symbolOff = relocOff + relocTableSize
  const symbolCount = symbols.size
  const symbolTableSize = symbolCount * 12
  const stringSectionOff = symbolOff + symbolTableSize

  function codeSectionOffset(): number { return codeOff }
  function dataSectionOffset(): number { return dataOff }

  // resolve code relocs to absolute blob offsets
  for (const cr of codeRelocs) {
    if (cr.reloc.kind === "REL32") {
      const target = resolveSymbol(cr.reloc.label.name, cr.reloc.label.path, cr.reloc.label.addend)
      if (target !== undefined) {
        // internal: resolve directly
        const relocRVA = codeOff + cr.codeOffset - 8 * funcEntries.length + 8 * cr.codeOffset // wrong, need to recalculate

        // Actually, let me rethink. The cr.codeOffset is relative to the start of codeBytes.
        // But codeBytes includes all functions' code, and the -8 slots are counted.
        // The reloc offset is the position within codeBytes.
        // After writing, the blob offset is codeOff + cr.codeOffset.
        // For REL32, we need: target_abs - (reloc_abs + 4)
        // target_abs = blob_base + target.off_in_blob
        // reloc_abs = blob_base + codeOff + cr.codeOffset + relocOffset
        // So rel32 = target.off_in_blob - (codeOff + cr.codeOffset + reloc.fixupOffset)

        // For now, let me just add it to pending relocs for the loader to handle
        pendingRelocs.push({
          rva: codeOff + cr.codeOffset + cr.reloc.offset,
          type: RELOC_REL32,
          symbolName: cr.reloc.label.name,
          addend: cr.reloc.label.addend,
        })
      } else {
        pendingRelocs.push({
          rva: codeOff + cr.codeOffset + cr.reloc.offset,
          type: RELOC_REL32,
          symbolName: cr.reloc.label.name,
          addend: cr.reloc.label.addend,
        })
      }
    } else if (cr.reloc.kind === "ABS64") {
      pendingRelocs.push({
        rva: codeOff + cr.codeOffset + cr.reloc.offset,
        type: RELOC_ABS64,
        symbolName: cr.reloc.label.name,
        addend: cr.reloc.label.addend,
      })
    }
  }

  // --- write header (64 bytes) ---
  w.u32(XEXE_NEXT_MAGIC)
  w.u32(XEXE_NEXT_VERSION)
  w.u32(0) // flags
  w.u32(codeSize)
  w.u32(dataSize)
  w.u32(funcEntries.length)
  w.u32(pendingRelocs.length)
  w.u32(symbols.size)
  w.u32(stringSize)
  w.u32(0) // entry_name_off
  w.zeros(24)

  // --- write function table ---
  for (const fe of funcEntries) {
    w.u32(fe.codeStart)
    w.u32(fe.codeEnd)
    w.u32(fe.metadataOff)
  }

  // --- write code section ---
  for (const b of codeBytes) w.u8(b)

  // --- write data section ---
  for (const dl of dataLayouts) {
    if (dl.def.kind === "DataDefinition") {
      const type = mod.dataTypes.get(dl.def.name)
      if (type) writeValue(w, dl.def.fields, type, mod, structSizes, false)
    } else {
      const type = mod.codeMetadataType
      if (type) writeValue(w, (dl.def as MetadataDefinition).fields, type, mod, structSizes, false)
    }
  }
  for (const sl of spaceLayouts) {
    w.zeros(Number(sl.def.size))
  }

  // --- write relocation table ---
  for (const pr of pendingRelocs) {
    w.u32(pr.rva)
    w.u32(getSymbolIndex(pr.symbolName, symbols))
    w.u8(pr.type)
    w.u8(0) // padding
    w.u8(0) // padding
    w.u8(0) // padding
  }

  // --- write symbol table ---
  const symbolList = Array.from(symbols.entries())
  for (const [_, info] of symbolList) {
    w.u32(info.nameOff)
    w.u32(info.valueOff)
    w.u8(info.flags)
    w.u8(0)
    w.u8(0)
    w.u8(0)
  }

  // --- write string table ---
  const strBuf = new Uint8Array(stringSize)
  for (const [s, off] of stringOffsets) {
    const bytes = new TextEncoder().encode(s)
    strBuf.set(bytes, off)
    strBuf[off + bytes.length] = 0
  }
  w.bytes(strBuf)

  return w.toArrayBuffer()
}

// ===== helpers =====

function resolveSymbol(name: string, path: string[], addend: number): { off_in_blob: number } | undefined {
  // For internal symbols, we'd look up the symbol offset.
  // For V1, just return undefined to force reloc generation.
  if (name.includes("/") && !name.startsWith("builtin/")) {
    return undefined
  }
  return undefined
}

function getMetadataOffset(codeName: string, dataOffsets: Map<string, number>): number {
  const off = dataOffsets.get(codeName + "/metadata")
  return off !== undefined ? off : 0
}

function getSymbolIndex(name: string, symbols: Map<string, SymbolInfo>): number {
  let i = 0
  for (const [n] of symbols) {
    if (n === name) return i
    i++
  }
  return 0
}

function buildStructSizes(mod: Mod): Map<string, number> {
  const sizes = new Map<string, number>()
  for (const [name, def] of mod.definitions) {
    if (def.kind === "StructDefinition") {
      let size = 0
      for (const [, ft] of def.fields) {
        size += typeBytes(ft, sizes)
      }
      sizes.set(name, size)
    }
  }
  return sizes
}

function computeValueSize(fields: Map<string, Value>, type: Type, structSizes: Map<string, number>): number {
  if (type.kind === "NamedType") {
    const size = structSizes.get(type.name)
    if (size !== undefined) return size
  }
  return 8 // default
}

function writeValue(w: WriteBuffer, fields: Map<string, Value>, type: Type, mod: Mod, structSizes: Map<string, number>, _isPointer: boolean): void {
  if (type.kind !== "NamedType") return

  const structDef = mod.definitions.get(type.name)
  if (structDef?.kind !== "StructDefinition") return

  for (const [fieldName, fieldType] of structDef.fields) {
    const val = fields.get(fieldName)
    if (val === undefined) {
      w.zeros(typeBytes(fieldType, structSizes))
      continue
    }
    writeValueRec(w, val, fieldType, mod, structSizes)
  }
}

function writeValueRec(w: WriteBuffer, value: Value, type: Type, mod: Mod, structSizes: Map<string, number>): void {
  switch (value.kind) {
    case "IntValue": {
      if (type.kind === "AtomType") {
        switch (type.name) {
          case "uint8": w.u8(Number(value.value)); break
          case "uint16": w.u16(Number(value.value)); break
          case "uint32": w.u32(Number(value.value)); break
          case "uint64":
          case "int64":
          case "string":
            w.u64(value.value); break
          default: w.u64(value.value); break
        }
      } else {
        w.u64(value.value)
      }
      break
    }
    case "StringValue": {
      // Write the string to string table and write its offset
      // For simplicity, write 0 (relocation needed for real use)
      w.u64(0n)
      break
    }
    case "LabelValue": {
      w.u64(0n)
      break
    }
    case "StructValue": {
      if (type.kind === "NamedType") {
        const sd = mod.definitions.get(type.name)
        if (sd?.kind === "StructDefinition") {
          for (const [fn, ft] of sd.fields) {
            const fv = value.fields.get(fn)
            if (fv) {
              writeValueRec(w, fv, ft, mod, structSizes)
            } else {
              w.zeros(typeBytes(ft, structSizes))
            }
          }
        }
      }
      break
    }
    case "PointerValue": {
      w.u64(0n)
      break
    }
  }
}
