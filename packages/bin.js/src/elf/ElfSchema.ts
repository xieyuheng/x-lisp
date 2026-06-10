import * as Bin from "../bin/index.ts"

// references:
// - /usr/include/elf.h
// - https://en.wikipedia.org/wiki/Executable_and_Linkable_Format
// - https://wiki.osdev.org/ELF
//   - The "Loading ELF Binaries" describe how OS load ELF program.

export const ElfSchema = Bin.Sequence([
  Bin.Magic(0x7f),
  Bin.Magic(0x45),
  Bin.Magic(0x4c),
  Bin.Magic(0x46),
  Bin.Attribute("class", Bin.Uint8()),
  Bin.Attribute("endianness", Bin.Uint8()),
  Bin.Attribute("version", Bin.Uint8()),
  Bin.Attribute("abi", Bin.Uint8()),
  Bin.Attribute("abi-version", Bin.Uint8()),
  Bin.Padding(7),
  Bin.Dependent((data) =>
    data["endianness"] === 1
      ? Bin.LittleEndian(ElfHeaderSchema)
      : Bin.BigEndian(ElfHeaderSchema),
  ),
  ElfProgramHeaderTableSchema(),
  ElfSectionHeaderTableSchema(),
])

const ElfHeaderSchema = Bin.Sequence([
  Bin.Attribute("type", Bin.Uint16()),
  Bin.Attribute("machine", Bin.Uint16()),
  Bin.Attribute("version", Bin.Uint32()), // again
  Bin.Dependent((data) =>
    data["class"] === 1
      ? Bin.Sequence([
          Bin.Attribute("entry", Bin.Uint32()),
          Bin.Attribute("program-headers-offset", Bin.Uint32()),
          Bin.Attribute("section-headers-offset", Bin.Uint32()),
        ])
      : Bin.Sequence([
          Bin.Attribute("entry", Bin.Uint64()),
          Bin.Attribute("program-headers-offset", Bin.Uint64()),
          Bin.Attribute("section-headers-offset", Bin.Uint64()),
        ]),
  ),
  Bin.Attribute("flags", Bin.Uint32()),
  Bin.Attribute("header-size", Bin.Uint16()),
  Bin.Attribute("program-header-size", Bin.Uint16()),
  Bin.Attribute("program-header-count", Bin.Uint16()),
  Bin.Attribute("section-header-size", Bin.Uint16()),
  Bin.Attribute("section-header-count", Bin.Uint16()),
  Bin.Attribute("section-name-header-index", Bin.Uint16()),
])

function ElfProgramHeaderTableSchema(): Bin.Exp {
  return Bin.Dependent((data) =>
    Bin.Offset(
      data["program-headers-offset"],
      Bin.Attribute(
        "program-headers",
        Bin.Array(
          data["program-header-count"],
          data["program-header-size"],
          data["class"] === 1
            ? Elf32ProgramHeaderSchema
            : Elf64ProgramHeaderSchema,
        ),
      ),
    ),
  )
}

const Elf32ProgramHeaderSchema = Bin.Sequence([
  Bin.Attribute("type", Bin.Uint32()),
  Bin.Attribute("offset", Bin.Uint32()),
  Bin.Attribute("virtual-address", Bin.Uint32()),
  Bin.Attribute("physical-address", Bin.Uint32()),
  Bin.Attribute("size-in-file", Bin.Uint32()),
  Bin.Attribute("size-in-memory", Bin.Uint32()),
  Bin.Attribute("flags", Bin.Uint32()),
  Bin.Attribute("alignment", Bin.Uint32()),
])

const Elf64ProgramHeaderSchema = Bin.Sequence([
  Bin.Attribute("type", Bin.Uint32()),
  Bin.Attribute("flags", Bin.Uint32()),
  Bin.Attribute("offset", Bin.Uint64()),
  Bin.Attribute("virtual-address", Bin.Uint64()),
  Bin.Attribute("physical-address", Bin.Uint64()),
  Bin.Attribute("size-in-file", Bin.Uint64()),
  Bin.Attribute("size-in-memory", Bin.Uint64()),
  Bin.Attribute("alignment", Bin.Uint64()),
])

function ElfSectionHeaderTableSchema(): Bin.Exp {
  return Bin.Dependent((data) =>
    Bin.Offset(
      data["section-headers-offset"],
      Bin.Attribute(
        "section-headers",
        Bin.Array(
          data["section-header-count"],
          data["section-header-size"],
          data["class"] === 1
            ? Elf32SectionHeaderSchema
            : Elf64SectionHeaderSchema,
        ),
      ),
    ),
  )
}

const Elf32SectionHeaderSchema = Bin.Sequence([
  Bin.Attribute("name", Bin.Uint32()),
  Bin.Attribute("type", Bin.Uint32()),
  Bin.Attribute("flags", Bin.Uint32()),
  Bin.Attribute("virtual-address", Bin.Uint32()),
  Bin.Attribute("offset", Bin.Uint32()),
  Bin.Attribute("size", Bin.Uint32()),
  Bin.Attribute("link", Bin.Uint32()),
  Bin.Attribute("info", Bin.Uint32()),
  Bin.Attribute("alignment", Bin.Uint32()),
  Bin.Attribute("entry-size", Bin.Uint32()),
])

const Elf64SectionHeaderSchema = Bin.Sequence([
  Bin.Attribute("name", Bin.Uint32()),
  Bin.Attribute("type", Bin.Uint32()),
  Bin.Attribute("flags", Bin.Uint64()),
  Bin.Attribute("virtual-address", Bin.Uint64()),
  Bin.Attribute("offset", Bin.Uint64()),
  Bin.Attribute("size", Bin.Uint64()),
  Bin.Attribute("link", Bin.Uint32()),
  Bin.Attribute("info", Bin.Uint32()),
  Bin.Attribute("alignment", Bin.Uint64()),
  Bin.Attribute("entry-size", Bin.Uint64()),
])
