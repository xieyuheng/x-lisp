import type { Codec, Endian } from "../codec/Codec.ts"
import {
  fixedArray,
  magic,
  offset,
  padding,
  State,
  structure,
  uint16,
  uint32,
  uint64,
  uint8,
} from "../codec/index.ts"
import type {
  Elf,
  ElfHeader,
  ElfIdent,
  ElfProgramHeader,
  ElfSectionHeader,
} from "./Elf.ts"

const elfIdentCodec = structure({
  fileClass: uint8,
  endianness: uint8,
  version: uint8,
  osAbi: uint8,
  abiVersion: uint8,
})

function elfHeaderCodec(is64: boolean): Codec<ElfHeader> {
  const pointer = is64 ? uint64 : uint32
  return structure({
    fileType: uint16,
    machine: uint16,
    version: uint32,
    entryAddress: pointer,
    programHeaderOffset: pointer,
    sectionHeaderOffset: pointer,
    flags: uint32,
    elfHeaderSize: uint16,
    programHeaderEntrySize: uint16,
    programHeaderCount: uint16,
    sectionHeaderEntrySize: uint16,
    sectionHeaderCount: uint16,
    sectionNameHeaderIndex: uint16,
  }) as unknown as Codec<ElfHeader>
}

function elfProgramHeaderCodec(is64: boolean): Codec<ElfProgramHeader> {
  if (is64) {
    return structure({
      segmentType: uint32,
      flags: uint32,
      fileOffset: uint64,
      virtualAddress: uint64,
      physicalAddress: uint64,
      fileByteSize: uint64,
      memoryByteSize: uint64,
      alignment: uint64,
    }) as unknown as Codec<ElfProgramHeader>
  }

  return structure({
    segmentType: uint32,
    fileOffset: uint32,
    virtualAddress: uint32,
    physicalAddress: uint32,
    fileByteSize: uint32,
    memoryByteSize: uint32,
    flags: uint32,
    alignment: uint32,
  }) as unknown as Codec<ElfProgramHeader>
}

function elfSectionHeaderCodec(is64: boolean): Codec<ElfSectionHeader> {
  const pointer = is64 ? uint64 : uint32
  return structure({
    nameOffset: uint32,
    sectionType: uint32,
    flags: pointer,
    virtualAddress: pointer,
    fileOffset: pointer,
    fileByteSize: pointer,
    link: uint32,
    info: uint32,
    addressAlignment: pointer,
    entryByteSize: pointer,
  }) as unknown as Codec<ElfSectionHeader>
}

function endianFromIdent(ident: ElfIdent): Endian {
  return ident.endianness === 1 ? "LittleEndian" : "BigEndian"
}

export function decodeElf(buffer: ArrayBuffer): Elf {
  const state = new State(buffer, "LittleEndian")
  magic([0x7f, 0x45, 0x4c, 0x46]).decode(state)

  const ident: ElfIdent = elfIdentCodec.decode(state)
  padding(7).decode(state)

  const elfEndian = endianFromIdent(ident)
  const is64 = ident.fileClass === 2
  state.endian = elfEndian

  const header: ElfHeader = elfHeaderCodec(is64).decode(state)

  const programHeaders: ElfProgramHeader[] = offset(
    Number(header.programHeaderOffset),
    fixedArray(header.programHeaderCount, elfProgramHeaderCodec(is64)),
  ).decode(state)

  const sectionHeaders: ElfSectionHeader[] = offset(
    Number(header.sectionHeaderOffset),
    fixedArray(header.sectionHeaderCount, elfSectionHeaderCodec(is64)),
  ).decode(state)

  return { ident, header, programHeaders, sectionHeaders }
}

export function encodeElf(elf: Elf): ArrayBuffer {
  const { ident, header, programHeaders, sectionHeaders } = elf
  const elfEndian = endianFromIdent(ident)
  const is64 = ident.fileClass === 2

  const headerCodec = elfHeaderCodec(is64)
  const programCodec = elfProgramHeaderCodec(is64)
  const sectionCodec = elfSectionHeaderCodec(is64)

  const programTableEnd =
    Number(header.programHeaderOffset) +
    header.programHeaderCount * header.programHeaderEntrySize
  const sectionTableEnd =
    Number(header.sectionHeaderOffset) +
    header.sectionHeaderCount * header.sectionHeaderEntrySize
  const fileSize = Math.max(
    16 + header.elfHeaderSize,
    programTableEnd,
    sectionTableEnd,
  )

  const buffer = new ArrayBuffer(fileSize)
  const state = new State(buffer, elfEndian)
  magic([0x7f, 0x45, 0x4c, 0x46]).encode(undefined, state)
  elfIdentCodec.encode(ident, state)
  padding(7).encode(undefined, state)
  state.endian = elfEndian

  headerCodec.encode(header, state)

  offset(
    Number(header.programHeaderOffset),
    fixedArray(header.programHeaderCount, programCodec),
  ).encode(programHeaders, state)

  offset(
    Number(header.sectionHeaderOffset),
    fixedArray(header.sectionHeaderCount, sectionCodec),
  ).encode(sectionHeaders, state)

  return buffer
}
