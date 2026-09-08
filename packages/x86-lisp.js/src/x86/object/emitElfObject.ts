import {
  ObjectCodeSection,
  ObjectDataSection,
  ObjectSpaceSection,
  type ObjectFile,
  type ObjectLabelEntry,
  type ObjectRelocation,
  type ObjectSectionKind,
} from "./types.ts"

// ---------------------------------------------------------------------------
// ELF64 constants
// ---------------------------------------------------------------------------

const EHDR_SIZE = 64
const SHDR_SIZE = 64
const SYM_SIZE = 24
const RELA_SIZE = 24

const ET_REL = 1
const EM_X86_64 = 62

const SHT_NULL = 0
const SHT_PROGBITS = 1
const SHT_SYMTAB = 2
const SHT_STRTAB = 3
const SHT_RELA = 4
const SHT_NOBITS = 8

const SHF_WRITE = 0x1
const SHF_ALLOC = 0x2
const SHF_EXECINSTR = 0x4

const STB_LOCAL = 0
const STB_GLOBAL = 1

const STT_NOTYPE = 0
const STT_OBJECT = 1
const STT_FUNC = 2

const SHN_UNDEF = 0

const R_X86_64_64 = 1
const R_X86_64_PC32 = 2

// Section indices. 0 is the mandatory null section.
const SECTION_TEXT = 1
const SECTION_DATA = 2
const SECTION_BSS = 3
const SECTION_RELA_TEXT = 4
const SECTION_RELA_DATA = 5
const SECTION_SYMTAB = 6
const SECTION_STRTAB = 7
const SECTION_SHSTRTAB = 8
const SECTION_NOTE_GNU_STACK = 9
const SECTION_COUNT = 10

// ---------------------------------------------------------------------------
// public entry
// ---------------------------------------------------------------------------

export function emitElfObject(object: ObjectFile): Uint8Array {
  const { symbols, nameToIndex, localCount } = buildSymbols(object)
  const strtab = buildStringTable(symbols.map((symbol) => symbol.name))
  const shstrtab = buildSectionHeaderStringTable()
  const relaText = buildRelaSection(object, nameToIndex, ObjectCodeSection)
  const relaData = buildRelaSection(object, nameToIndex, ObjectDataSection)
  const symtab = buildSymtab(symbols)

  let offset = EHDR_SIZE
  const textOffset = align(offset, 16)
  offset = textOffset + object.code.byteLength
  const dataOffset = align(offset, 8)
  offset = dataOffset + object.data.byteLength
  const bssOffset = align(offset, 8)
  const relaTextOffset = align(offset, 8)
  offset = relaTextOffset + relaText.byteLength
  const relaDataOffset = align(offset, 8)
  offset = relaDataOffset + relaData.byteLength
  const symtabOffset = align(offset, 8)
  offset = symtabOffset + symtab.byteLength
  const strtabOffset = align(offset, 1)
  offset = strtabOffset + strtab.byteLength
  const shstrtabOffset = align(offset, 1)
  offset = shstrtabOffset + shstrtab.bytes.byteLength
  const sectionHeaderOffset = align(offset, 8)

  const buf = new Uint8Array(sectionHeaderOffset + SECTION_COUNT * SHDR_SIZE)

  writeElfHeader(buf, sectionHeaderOffset)
  buf.set(object.code, textOffset)
  buf.set(object.data, dataOffset)
  buf.set(relaText, relaTextOffset)
  buf.set(relaData, relaDataOffset)
  buf.set(symtab, symtabOffset)
  buf.set(strtab, strtabOffset)
  buf.set(shstrtab.bytes, shstrtabOffset)

  const sectionHeaderBase = sectionHeaderOffset
  const writeSection = (index: number, header: SectionHeader): void => {
    writeSectionHeader(buf, sectionHeaderBase + index * SHDR_SIZE, header)
  }

  writeSection(0, nullSectionHeader())
  writeSection(SECTION_TEXT, {
    name: shstrtab.offsets[".text"],
    type: SHT_PROGBITS,
    flags: SHF_ALLOC | SHF_EXECINSTR,
    offset: textOffset,
    size: object.code.byteLength,
    link: 0,
    info: 0,
    align: 16,
    entsize: 0,
  })
  writeSection(SECTION_DATA, {
    name: shstrtab.offsets[".data"],
    type: SHT_PROGBITS,
    flags: SHF_ALLOC | SHF_WRITE,
    offset: dataOffset,
    size: object.data.byteLength,
    link: 0,
    info: 0,
    align: 8,
    entsize: 0,
  })
  writeSection(SECTION_BSS, {
    name: shstrtab.offsets[".bss"],
    type: SHT_NOBITS,
    flags: SHF_ALLOC | SHF_WRITE,
    offset: bssOffset,
    size: object.spaceSize,
    link: 0,
    info: 0,
    align: 8,
    entsize: 0,
  })
  writeSection(SECTION_RELA_TEXT, {
    name: shstrtab.offsets[".rela.text"],
    type: SHT_RELA,
    flags: 0,
    offset: relaTextOffset,
    size: relaText.byteLength,
    link: SECTION_SYMTAB,
    info: SECTION_TEXT,
    align: 8,
    entsize: RELA_SIZE,
  })
  writeSection(SECTION_RELA_DATA, {
    name: shstrtab.offsets[".rela.data"],
    type: SHT_RELA,
    flags: 0,
    offset: relaDataOffset,
    size: relaData.byteLength,
    link: SECTION_SYMTAB,
    info: SECTION_DATA,
    align: 8,
    entsize: RELA_SIZE,
  })
  writeSection(SECTION_SYMTAB, {
    name: shstrtab.offsets[".symtab"],
    type: SHT_SYMTAB,
    flags: 0,
    offset: symtabOffset,
    size: symtab.byteLength,
    link: SECTION_STRTAB,
    info: localCount,
    align: 8,
    entsize: SYM_SIZE,
  })
  writeSection(SECTION_STRTAB, {
    name: shstrtab.offsets[".strtab"],
    type: SHT_STRTAB,
    flags: 0,
    offset: strtabOffset,
    size: strtab.byteLength,
    link: 0,
    info: 0,
    align: 1,
    entsize: 0,
  })
  writeSection(SECTION_SHSTRTAB, {
    name: shstrtab.offsets[".shstrtab"],
    type: SHT_STRTAB,
    flags: 0,
    offset: shstrtabOffset,
    size: shstrtab.bytes.byteLength,
    link: 0,
    info: 0,
    align: 1,
    entsize: 0,
  })
  writeSection(SECTION_NOTE_GNU_STACK, {
    name: shstrtab.offsets[".note.GNU-stack"],
    type: SHT_PROGBITS,
    flags: 0,
    offset: 0,
    size: 0,
    link: 0,
    info: 0,
    align: 1,
    entsize: 0,
  })

  return buf
}

// ---------------------------------------------------------------------------
// symbols
// ---------------------------------------------------------------------------

type ElfSymbol = {
  name: string
  bind: number
  type: number
  shndx: number
  value: number
  size: number
}

function buildSymbols(object: ObjectFile): {
  symbols: Array<ElfSymbol>
  nameToIndex: Map<string, number>
  localCount: number
} {
  const labelsByName = new Map<string, ObjectLabelEntry>()
  for (const label of object.labels) {
    labelsByName.set(label.name, label)
  }

  const sizes = computeSymbolSizes(object)

  const localLabels = object.labels.filter((label) => label.kind === "local")
  const globalLabels = object.labels.filter((label) => label.kind !== "local")

  const symbols: Array<ElfSymbol> = []
  const nameToIndex = new Map<string, number>()

  // Symbol 0 is the mandatory null symbol, and it is local.
  symbols.push({
    name: "",
    bind: STB_LOCAL,
    type: STT_NOTYPE,
    shndx: SHN_UNDEF,
    value: 0,
    size: 0,
  })

  for (const label of localLabels) {
    nameToIndex.set(label.name, symbols.length)
    symbols.push({
      name: label.name,
      bind: STB_LOCAL,
      type: STT_NOTYPE,
      shndx: sectionIndexOf(label.sectionKind),
      value: label.sectionOffset,
      size: 0,
    })
  }

  const localCount = symbols.length

  for (const label of globalLabels) {
    nameToIndex.set(label.name, symbols.length)
    symbols.push({
      name: label.name,
      bind: STB_GLOBAL,
      type: symbolType(label.kind),
      shndx: sectionIndexOf(label.sectionKind),
      value: label.sectionOffset,
      size: sizes.get(label.name) ?? 0,
    })
  }

  const externNames: Array<string> = []
  const seen = new Set<string>()
  for (const relocation of object.relocations) {
    if (labelsByName.has(relocation.name)) continue
    if (seen.has(relocation.name)) continue
    seen.add(relocation.name)
    externNames.push(relocation.name)
  }

  for (const name of externNames) {
    nameToIndex.set(name, symbols.length)
    symbols.push({
      name,
      bind: STB_GLOBAL,
      type: STT_NOTYPE,
      shndx: SHN_UNDEF,
      value: 0,
      size: 0,
    })
  }

  return { symbols, nameToIndex, localCount }
}

function computeSymbolSizes(object: ObjectFile): Map<string, number> {
  const sizes = new Map<string, number>()

  computeSectionSizes(
    sizes,
    object.labels.filter((label) => label.kind === "function"),
    object.code.byteLength,
  )
  computeSectionSizes(
    sizes,
    object.labels.filter((label) => label.kind === "data"),
    object.data.byteLength,
  )
  computeSectionSizes(
    sizes,
    object.labels.filter((label) => label.kind === "space"),
    object.spaceSize,
  )

  return sizes
}

function computeSectionSizes(
  sizes: Map<string, number>,
  labels: Array<ObjectLabelEntry>,
  sectionSize: number,
): void {
  const sorted = [...labels].sort((a, b) => a.sectionOffset - b.sectionOffset)
  for (let i = 0; i < sorted.length; i++) {
    const label = sorted[i]
    if (label.kind === "local") continue
    const nextOffset =
      i + 1 < sorted.length ? sorted[i + 1].sectionOffset : sectionSize
    sizes.set(label.name, nextOffset - label.sectionOffset)
  }
}

function sectionIndexOf(kind: ObjectSectionKind): number {
  switch (kind) {
    case ObjectCodeSection:
      return SECTION_TEXT
    case ObjectDataSection:
      return SECTION_DATA
    case ObjectSpaceSection:
      return SECTION_BSS
  }
}

function symbolType(kind: ObjectLabelEntry["kind"]): number {
  switch (kind) {
    case "function":
      return STT_FUNC
    case "data":
    case "space":
      return STT_OBJECT
    case "local":
      return STT_NOTYPE
  }
}

// ---------------------------------------------------------------------------
// relocations
// ---------------------------------------------------------------------------

function buildRelaSection(
  object: ObjectFile,
  nameToIndex: Map<string, number>,
  sectionKind: ObjectSectionKind,
): Uint8Array {
  const relocations = object.relocations
    .filter((relocation) => relocation.sectionKind === sectionKind)
    .sort((a, b) => a.sectionOffset - b.sectionOffset)

  const buf = new Uint8Array(relocations.length * RELA_SIZE)

  for (let i = 0; i < relocations.length; i++) {
    const relocation = relocations[i]
    const symbolIndex = nameToIndex.get(relocation.name)
    if (symbolIndex === undefined) {
      let message = `[emitElfObject] unknown relocation symbol: ${relocation.name}`
      throw new Error(message)
    }

    const base = i * RELA_SIZE
    writeU64LE(buf, base, BigInt(relocation.sectionOffset))
    writeU64LE(
      buf,
      base + 8,
      (BigInt(symbolIndex) << 32n) | BigInt(relocationType(relocation)),
    )
    writeI64LE(buf, base + 16, relocation.addend)
  }

  return buf
}

function relocationType(relocation: ObjectRelocation): number {
  if (relocation.type === "label-rel32") return R_X86_64_PC32
  return R_X86_64_64
}

// ---------------------------------------------------------------------------
// string tables
// ---------------------------------------------------------------------------

function buildStringTable(names: Array<string>): Uint8Array {
  const parts: Array<number> = [0]
  for (const name of names) {
    for (const byte of new TextEncoder().encode(name)) {
      parts.push(byte)
    }
    parts.push(0)
  }
  return Uint8Array.from(parts)
}

function buildSectionHeaderStringTable(): {
  bytes: Uint8Array
  offsets: Record<string, number>
} {
  const names = [
    ".text",
    ".data",
    ".bss",
    ".rela.text",
    ".rela.data",
    ".symtab",
    ".strtab",
    ".shstrtab",
    ".note.GNU-stack",
  ]

  const parts: Array<number> = [0]
  const offsets: Record<string, number> = {}
  for (const name of names) {
    offsets[name] = parts.length
    for (const byte of new TextEncoder().encode(name)) {
      parts.push(byte)
    }
    parts.push(0)
  }

  return { bytes: Uint8Array.from(parts), offsets }
}

// ---------------------------------------------------------------------------
// table encoding
// ---------------------------------------------------------------------------

function buildSymtab(symbols: Array<ElfSymbol>): Uint8Array {
  const offsets = buildStringOffsets(symbols.map((symbol) => symbol.name))

  const buf = new Uint8Array(symbols.length * SYM_SIZE)
  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i]
    const base = i * SYM_SIZE
    writeU32LE(buf, base, offsets[i])
    buf[base + 4] = (symbol.bind << 4) | symbol.type
    buf[base + 5] = 0
    writeU16LE(buf, base + 6, symbol.shndx)
    writeU64LE(buf, base + 8, BigInt(symbol.value))
    writeU64LE(buf, base + 16, BigInt(symbol.size))
  }

  return buf
}

function buildStringOffsets(names: Array<string>): Array<number> {
  const offsets: Array<number> = []
  let offset = 1
  for (const name of names) {
    offsets.push(offset)
    offset += new TextEncoder().encode(name).byteLength + 1
  }
  return offsets
}

// ---------------------------------------------------------------------------
// ELF header / section header
// ---------------------------------------------------------------------------

function writeElfHeader(buf: Uint8Array, sectionHeaderOffset: number): void {
  buf[0] = 0x7f
  buf[1] = 0x45 // 'E'
  buf[2] = 0x4c // 'L'
  buf[3] = 0x46 // 'F'
  buf[4] = 2 // ELFCLASS64
  buf[5] = 1 // ELFDATA2LSB
  buf[6] = 1 // EV_CURRENT
  buf[7] = 0 // ELFOSABI_NONE

  writeU16LE(buf, 16, ET_REL)
  writeU16LE(buf, 18, EM_X86_64)
  writeU32LE(buf, 20, 1)
  writeU64LE(buf, 24, 0n)
  writeU64LE(buf, 32, 0n)
  writeU64LE(buf, 40, BigInt(sectionHeaderOffset))
  writeU32LE(buf, 48, 0)
  writeU16LE(buf, 52, EHDR_SIZE)
  writeU16LE(buf, 54, 0)
  writeU16LE(buf, 56, 0)
  writeU16LE(buf, 58, SHDR_SIZE)
  writeU16LE(buf, 60, SECTION_COUNT)
  writeU16LE(buf, 62, SECTION_SHSTRTAB)
}

type SectionHeader = {
  name: number
  type: number
  flags: number
  offset: number
  size: number
  link: number
  info: number
  align: number
  entsize: number
}

function nullSectionHeader(): SectionHeader {
  return {
    name: 0,
    type: SHT_NULL,
    flags: 0,
    offset: 0,
    size: 0,
    link: 0,
    info: 0,
    align: 0,
    entsize: 0,
  }
}

function writeSectionHeader(
  buf: Uint8Array,
  offset: number,
  header: SectionHeader,
): void {
  writeU32LE(buf, offset, header.name)
  writeU32LE(buf, offset + 4, header.type)
  writeU64LE(buf, offset + 8, BigInt(header.flags))
  writeU64LE(buf, offset + 16, 0n)
  writeU64LE(buf, offset + 24, BigInt(header.offset))
  writeU64LE(buf, offset + 32, BigInt(header.size))
  writeU32LE(buf, offset + 40, header.link)
  writeU32LE(buf, offset + 44, header.info)
  writeU64LE(buf, offset + 48, BigInt(header.align))
  writeU64LE(buf, offset + 56, BigInt(header.entsize))
}

// ---------------------------------------------------------------------------
// primitives
// ---------------------------------------------------------------------------

function align(value: number, alignment: number): number {
  return (value + alignment - 1) & ~(alignment - 1)
}

function writeU16LE(buf: Uint8Array, offset: number, value: number): void {
  buf[offset] = value & 0xff
  buf[offset + 1] = (value >> 8) & 0xff
}

function writeU32LE(buf: Uint8Array, offset: number, value: number): void {
  buf[offset] = value & 0xff
  buf[offset + 1] = (value >> 8) & 0xff
  buf[offset + 2] = (value >> 16) & 0xff
  buf[offset + 3] = (value >> 24) & 0xff
}

function writeU64LE(buf: Uint8Array, offset: number, value: bigint): void {
  for (let i = 0; i < 8; i++) {
    buf[offset + i] = Number((value >> BigInt(i * 8)) & 0xffn)
  }
}

function writeI64LE(buf: Uint8Array, offset: number, value: bigint): void {
  writeU64LE(buf, offset, BigInt.asUintN(64, value))
}
