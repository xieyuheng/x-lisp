import assert from "node:assert/strict"
import { test } from "node:test"
import { decodeTlv, encodeTlv } from "../../tlv/index.ts"
import { decodeExe, decodeNameTable } from "./decodeExe.ts"
import { encodeExe } from "./encodeExe.ts"
import { makeNameTable, type Exe } from "./Exe.ts"

test("encodeExe / decodeExe: round-trip", () => {
  const nameTable = makeNameTable([
    "main",
    "square",
    "x",
    "meta-builtin/builtin/imul",
    "meta-builtin/builtin/true",
    "string-value",
    "hello",
  ])

  const exe: Exe = {
    nameTable,
    functions: [
      {
        name: "main",
        arity: 0,
        localCount: 1,
        code: new Uint8Array([0x01, 0x02]),
      },
      {
        name: "square",
        arity: 1,
        localCount: 2,
        code: new Uint8Array([0x03, 0x04, 0x05]),
      },
    ],
    variables: [{ name: "x" }],
    primitiveFunctions: [{ name: "meta-builtin/builtin/imul" }],
    primitiveVariables: [{ name: "meta-builtin/builtin/true" }],
    functionFixupTable: {
      fixups: [
        {
          type: "string-value",
          name: "hello",
          destName: "main",
          destOffset: 2,
        },
      ],
    },
  }

  const tlv = encodeExe(exe)
  const bytes = encodeTlv(tlv)
  const decodedTlv = decodeTlv(bytes)
  const decodedExe = decodeExe(decodedTlv)

  assert.deepEqual(decodedExe.nameTable.names, nameTable.names)
  assert.equal(decodedExe.functions.length, 2)
  assert.equal(decodedExe.functions[0].name, "main")
  assert.equal(decodedExe.functions[0].arity, 0)
  assert.equal(decodedExe.functions[0].localCount, 1)
  assert.deepEqual(Array.from(decodedExe.functions[0].code), [0x01, 0x02])
  assert.equal(decodedExe.functions[1].name, "square")
  assert.equal(decodedExe.functions[1].arity, 1)
  assert.equal(decodedExe.functions[1].localCount, 2)
  assert.deepEqual(Array.from(decodedExe.functions[1].code), [0x03, 0x04, 0x05])
  assert.deepEqual(decodedExe.variables, [{ name: "x" }])
  assert.deepEqual(decodedExe.primitiveFunctions, [
    { name: "meta-builtin/builtin/imul" },
  ])
  assert.deepEqual(decodedExe.primitiveVariables, [
    { name: "meta-builtin/builtin/true" },
  ])
  assert.equal(decodedExe.functionFixupTable.fixups.length, 1)
  assert.equal(decodedExe.functionFixupTable.fixups[0].type, "string-value")
  assert.equal(decodedExe.functionFixupTable.fixups[0].name, "hello")
  assert.equal(decodedExe.functionFixupTable.fixups[0].destName, "main")
  assert.equal(decodedExe.functionFixupTable.fixups[0].destOffset, 2)
})

test("decodeExe: missing fixup table gives empty table", () => {
  const nameTable = makeNameTable(["main"])
  const exe: Exe = {
    nameTable,
    functions: [],
    variables: [],
    primitiveFunctions: [],
    primitiveVariables: [],
    functionFixupTable: {
      fixups: [],
    },
  }

  const tlv = encodeExe(exe)
  const bytes = encodeTlv(tlv)
  const decodedExe = decodeExe(decodeTlv(bytes))

  assert.deepEqual(decodedExe.functionFixupTable.fixups, [])
})

test("decodeNameTable: missing final NUL throws", () => {
  assert.throws(() => {
    decodeNameTable(new TextEncoder().encode("main"))
  }, /does not end with NUL/)
})