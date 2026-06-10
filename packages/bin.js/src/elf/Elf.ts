export type ElfIdent = {
  fileClass: number
  endianness: number
  version: number
  osAbi: number
  abiVersion: number
}

export type ElfHeader = {
  fileType: number
  machine: number
  version: number
  entryAddress: number | bigint
  programHeaderOffset: number | bigint
  sectionHeaderOffset: number | bigint
  flags: number
  elfHeaderSize: number
  programHeaderEntrySize: number
  programHeaderCount: number
  sectionHeaderEntrySize: number
  sectionHeaderCount: number
  sectionNameHeaderIndex: number
}

export type ElfProgramHeader = {
  segmentType: number
  flags: number
  fileOffset: number | bigint
  virtualAddress: number | bigint
  physicalAddress: number | bigint
  fileByteSize: number | bigint
  memoryByteSize: number | bigint
  alignment: number | bigint
}

export type ElfSectionHeader = {
  nameOffset: number
  sectionType: number
  flags: number | bigint
  virtualAddress: number | bigint
  fileOffset: number | bigint
  fileByteSize: number | bigint
  link: number
  info: number
  addressAlignment: number | bigint
  entryByteSize: number | bigint
}

export type Elf = {
  ident: ElfIdent
  header: ElfHeader
  programHeaders: ElfProgramHeader[]
  sectionHeaders: ElfSectionHeader[]
}
