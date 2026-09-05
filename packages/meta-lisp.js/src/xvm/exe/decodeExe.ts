import { readU16LE, readU32LE } from "@xieyuheng/std.js/binary"
import { type Tlv } from "../../tlv/index.ts"
import {
  ExeTags,
  makeNameTable,
  nameTableGetName,
  parseFixupType,
  type Exe,
  type ExeFunctionDefinition,
  type ExePrimitiveFunctionDeclaration,
  type ExePrimitiveVariableDeclaration,
  type ExeVariableDeclaration,
  type FunctionFixup,
  type FunctionFixupTable,
  type NameTable,
} from "./Exe.ts"

export function decodeExe(tlv: Tlv): Exe {
  const nameTableEntry = tlv.entries.find(
    (entry) => entry.tag === ExeTags.NameTable,
  )
  if (nameTableEntry === undefined) {
    throw new Error("[decodeExe] missing name table")
  }

  const nameTable = decodeNameTable(nameTableEntry.value)
  return {
    nameTable,
    functions: tlv.entries
      .filter((entry) => entry.tag === ExeTags.FunctionDefinition)
      .map((entry) => decodeFunctionDefinition(nameTable, entry.value)),
    variables: tlv.entries
      .filter((entry) => entry.tag === ExeTags.VariableDeclaration)
      .map((entry) => decodeVariableDeclaration(nameTable, entry.value)),
    primitiveFunctions: tlv.entries
      .filter((entry) => entry.tag === ExeTags.PrimitiveFunctionDeclaration)
      .map((entry) =>
        decodePrimitiveFunctionDeclaration(nameTable, entry.value),
      ),
    primitiveVariables: tlv.entries
      .filter((entry) => entry.tag === ExeTags.PrimitiveVariableDeclaration)
      .map((entry) =>
        decodePrimitiveVariableDeclaration(nameTable, entry.value),
      ),
    functionFixupTable: decodeFunctionFixupTable(
      nameTable,
      tlv.entries.find((entry) => entry.tag === ExeTags.FunctionFixupTable)
        ?.value ?? new Uint8Array([]),
    ),
  }
}

export function decodeNameTable(value: Uint8Array): NameTable {
  return makeNameTable(decodeCStrings(value))
}

function decodeCStrings(value: Uint8Array): Array<string> {
  const decoder = new TextDecoder()
  const names: Array<string> = []

  if (value.byteLength === 0) {
    return names
  }

  let start = 0
  for (let i = 0; i < value.byteLength; i++) {
    if (value[i] === 0) {
      names.push(decoder.decode(value.subarray(start, i)))
      start = i + 1
    }
  }

  if (start < value.byteLength) {
    throw new Error("[decodeCStrings] name table does not end with NUL")
  }

  return names
}

export function decodeFunctionDefinition(
  nameTable: NameTable,
  value: Uint8Array,
): ExeFunctionDefinition {
  const nameOffset = readU32LE(value, 0)
  const arity = readU16LE(value, 4)
  const localCount = readU16LE(value, 6)
  const codeLength = readU32LE(value, 8)
  const code = value.slice(12, 12 + codeLength)

  let offset = 12 + codeLength

  const localNamesResult = readLocalNameOffsets(
    value,
    offset,
    nameTable,
    localCount,
  )
  offset = localNamesResult.nextOffset

  const labelsResult = readLabels(value, offset, nameTable)
  offset = labelsResult.nextOffset

  return {
    name: nameTableGetName(nameTable, nameOffset),
    arity,
    localNames: localNamesResult.localNames,
    labels: labelsResult.labels,
    code,
  }
}

function readLocalNameOffsets(
  value: Uint8Array,
  offset: number,
  nameTable: NameTable,
  localCount: number,
): {
  localNames: Array<string>
  nextOffset: number
} {
  const localNames: Array<string> = []
  for (let i = 0; i < localCount; i++) {
    localNames.push(nameTableGetName(nameTable, readU32LE(value, offset)))
    offset += 4
  }

  return {
    localNames,
    nextOffset: offset,
  }
}

function readLabels(
  value: Uint8Array,
  offset: number,
  nameTable: NameTable,
): {
  labels: Array<{ name: string; offset: number }>
  nextOffset: number
} {
  const labelCount = readU32LE(value, offset)
  offset += 4

  const labelNameOffsets: Array<number> = []
  for (let i = 0; i < labelCount; i++) {
    labelNameOffsets.push(readU32LE(value, offset))
    offset += 4
  }

  const labels: Array<{ name: string; offset: number }> = []
  for (let i = 0; i < labelCount; i++) {
    const labelOffset = readU32LE(value, offset)
    offset += 4
    labels.push({
      name: nameTableGetName(nameTable, labelNameOffsets[i]),
      offset: labelOffset,
    })
  }

  return {
    labels,
    nextOffset: offset,
  }
}

export function decodeVariableDeclaration(
  nameTable: NameTable,
  value: Uint8Array,
): ExeVariableDeclaration {
  return {
    name: nameTableGetName(nameTable, readU32LE(value, 0)),
  }
}

export function decodePrimitiveFunctionDeclaration(
  nameTable: NameTable,
  value: Uint8Array,
): ExePrimitiveFunctionDeclaration {
  return {
    name: nameTableGetName(nameTable, readU32LE(value, 0)),
  }
}

export function decodePrimitiveVariableDeclaration(
  nameTable: NameTable,
  value: Uint8Array,
): ExePrimitiveVariableDeclaration {
  return {
    name: nameTableGetName(nameTable, readU32LE(value, 0)),
  }
}

export function decodeFunctionFixupTable(
  nameTable: NameTable,
  value: Uint8Array,
): FunctionFixupTable {
  const fixups: Array<FunctionFixup> = []
  let offset = 0

  while (offset < value.byteLength) {
    const { fixup, nextOffset } = readFunctionFixup(value, offset, nameTable)
    fixups.push(fixup)
    offset = nextOffset
  }

  return {
    fixups,
  }
}

export function readFunctionFixup(
  bytes: Uint8Array,
  offset: number,
  nameTable: NameTable,
): {
  fixup: FunctionFixup
  nextOffset: number
} {
  const typeOffset = readU32LE(bytes, offset)
  const nameOffset = readU32LE(bytes, offset + 4)
  const destNameOffset = readU32LE(bytes, offset + 8)
  const destOffset = readU32LE(bytes, offset + 12)

  return {
    fixup: {
      type: parseFixupType(nameTableGetName(nameTable, typeOffset)),
      name: nameTableGetName(nameTable, nameOffset),
      destName: nameTableGetName(nameTable, destNameOffset),
      destOffset,
    },
    nextOffset: offset + 16,
  }
}
