import assert from "node:assert"
import fs from "node:fs"
import { test } from "node:test"
import {
  type Elf,
  type ElfHeader,
  type ElfIdent,
  decodeElf,
  encodeElf,
} from "./index.ts"

test("ELF round-trip: synthetic 64-bit LE ELF", () => {
  const ident: ElfIdent = {
    fileClass: 2,
    endianness: 1,
    version: 1,
    osAbi: 0,
    abiVersion: 0,
  }

  const header: ElfHeader = {
    fileType: 2,
    machine: 62,
    version: 1,
    entryAddress: 0x400000n,
    programHeaderOffset: 0n,
    sectionHeaderOffset: 0n,
    flags: 0,
    elfHeaderSize: 64,
    programHeaderEntrySize: 56,
    programHeaderCount: 0,
    sectionHeaderEntrySize: 64,
    sectionHeaderCount: 0,
    sectionNameHeaderIndex: 0,
  }

  const original: Elf = {
    ident,
    header,
    programHeaders: [],
    sectionHeaders: [],
  }

  const buffer = encodeElf(original)
  const decoded = decodeElf(buffer)

  assert.deepEqual(decoded, original)
})

test("ELF round-trip: decode/encode real ELF binary", () => {
  const elfPath = process.execPath
  const buffer = fs.readFileSync(elfPath).buffer
  const decoded = decodeElf(buffer)
  const reencoded = encodeElf(decoded)

  assert.ok(reencoded instanceof ArrayBuffer)

  const redecoded = decodeElf(reencoded)

  assert.deepEqual(redecoded.ident, decoded.ident)
  assert.deepEqual(redecoded.header, decoded.header)
  assert.deepEqual(redecoded.programHeaders, decoded.programHeaders)
  assert.deepEqual(redecoded.sectionHeaders, decoded.sectionHeaders)
})
