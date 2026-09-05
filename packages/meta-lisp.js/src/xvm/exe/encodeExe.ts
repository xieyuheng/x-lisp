import { writeU16LE, writeU32LE } from "@xieyuheng/std.js/binary"
import { Tlv, TlvEntry } from "../../tlv/index.ts"
import {
  ExeTags,
  nameTableGetOffset,
  type Exe,
  type ExeFunctionDefinition,
  type ExeLabel,
  type ExePrimitiveFunctionDeclaration,
  type ExePrimitiveVariableDeclaration,
  type ExeVariableDeclaration,
  type FunctionFixup,
  type FunctionFixupTable,
  type NameTable,
} from "./Exe.ts"

export function encodeExe(exe: Exe): Tlv {
  return Tlv([
    TlvEntry(ExeTags.NameTable, encodeNameTable(exe.nameTable)),
    ...exe.functions.map((fn) =>
      TlvEntry(
        ExeTags.FunctionDefinition,
        encodeFunctionDefinition(exe.nameTable, fn),
      ),
    ),
    ...exe.variables.map((variable) =>
      TlvEntry(
        ExeTags.VariableDeclaration,
        encodeVariableDeclaration(exe.nameTable, variable),
      ),
    ),
    ...exe.primitiveFunctions.map((primitive) =>
      TlvEntry(
        ExeTags.PrimitiveFunctionDeclaration,
        encodePrimitiveFunctionDeclaration(exe.nameTable, primitive),
      ),
    ),
    ...exe.primitiveVariables.map((primitive) =>
      TlvEntry(
        ExeTags.PrimitiveVariableDeclaration,
        encodePrimitiveVariableDeclaration(exe.nameTable, primitive),
      ),
    ),
    TlvEntry(
      ExeTags.FunctionFixupTable,
      encodeFunctionFixupTable(exe.nameTable, exe.functionFixupTable),
    ),
  ])
}

export function encodeNameTable(nameTable: NameTable): Uint8Array {
  const encoder = new TextEncoder()
  const encodedNames = nameTable.names.map((name) => encoder.encode(name))

  let totalSize = 0
  for (const encoded of encodedNames) {
    totalSize += encoded.byteLength + 1
  }

  const bytes = new Uint8Array(totalSize)
  let offset = 0

  for (const encoded of encodedNames) {
    bytes.set(encoded, offset)
    offset += encoded.byteLength
    bytes[offset] = 0
    offset += 1
  }

  return bytes
}

export function encodeFunctionDefinition(
  nameTable: NameTable,
  fn: ExeFunctionDefinition,
): Uint8Array {
  const bytes = new Uint8Array(
    4 +
      2 +
      2 +
      4 +
      fn.code.byteLength +
      fn.localNames.length * 4 +
      4 +
      fn.labels.length * 8,
  )
  let offset = 0

  offset = writeU32LE(bytes, offset, nameTableGetOffset(nameTable, fn.name))
  offset = writeU16LE(bytes, offset, fn.arity)
  offset = writeU16LE(bytes, offset, fn.localNames.length)
  offset = writeU32LE(bytes, offset, fn.code.byteLength)
  bytes.set(fn.code, offset)
  offset += fn.code.byteLength

  offset = writeLocalNameOffsets(bytes, offset, nameTable, fn.localNames)
  offset = writeLabels(bytes, offset, nameTable, fn.labels)

  return bytes
}

function writeLocalNameOffsets(
  bytes: Uint8Array,
  offset: number,
  nameTable: NameTable,
  localNames: Array<string>,
): number {
  for (const name of localNames) {
    offset = writeU32LE(bytes, offset, nameTableGetOffset(nameTable, name))
  }

  return offset
}

function writeLabels(
  bytes: Uint8Array,
  offset: number,
  nameTable: NameTable,
  labels: Array<ExeLabel>,
): number {
  offset = writeU32LE(bytes, offset, labels.length)

  for (const label of labels) {
    offset = writeU32LE(
      bytes,
      offset,
      nameTableGetOffset(nameTable, label.name),
    )
  }
  for (const label of labels) {
    offset = writeU32LE(bytes, offset, label.offset)
  }

  return offset
}

export function encodeVariableDeclaration(
  nameTable: NameTable,
  variable: ExeVariableDeclaration,
): Uint8Array {
  const bytes = new Uint8Array(4)
  writeU32LE(bytes, 0, nameTableGetOffset(nameTable, variable.name))
  return bytes
}

export function encodePrimitiveFunctionDeclaration(
  nameTable: NameTable,
  primitive: ExePrimitiveFunctionDeclaration,
): Uint8Array {
  const bytes = new Uint8Array(4)
  writeU32LE(bytes, 0, nameTableGetOffset(nameTable, primitive.name))
  return bytes
}

export function encodePrimitiveVariableDeclaration(
  nameTable: NameTable,
  primitive: ExePrimitiveVariableDeclaration,
): Uint8Array {
  const bytes = new Uint8Array(4)
  writeU32LE(bytes, 0, nameTableGetOffset(nameTable, primitive.name))
  return bytes
}

export function encodeFunctionFixupTable(
  nameTable: NameTable,
  table: FunctionFixupTable,
): Uint8Array {
  const bytes = new Uint8Array(table.fixups.length * 16)
  let offset = 0

  for (const fixup of table.fixups) {
    offset = writeFunctionFixup(bytes, offset, nameTable, fixup)
  }

  return bytes
}

export function writeFunctionFixup(
  bytes: Uint8Array,
  offset: number,
  nameTable: NameTable,
  fixup: FunctionFixup,
): number {
  offset = writeU32LE(bytes, offset, nameTableGetOffset(nameTable, fixup.type))
  offset = writeU32LE(bytes, offset, nameTableGetOffset(nameTable, fixup.name))
  offset = writeU32LE(
    bytes,
    offset,
    nameTableGetOffset(nameTable, fixup.destName),
  )
  offset = writeU32LE(bytes, offset, fixup.destOffset)

  return offset
}
