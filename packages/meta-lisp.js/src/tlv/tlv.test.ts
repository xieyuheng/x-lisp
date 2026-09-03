import assert from "node:assert/strict"
import { test } from "node:test"
import { decodeTlv } from "./decode.ts"
import { encodeTlv } from "./encode.ts"
import { Tlv, TlvEntry } from "./types.ts"

test("encodeTlv / decodeTlv: round-trip", () => {
  const tlv = Tlv([
    TlvEntry(0x01, new Uint8Array([0x61, 0x00, 0x62, 0x00])),
    TlvEntry(0x10, new Uint8Array([0x00, 0x00])),
  ])

  const bytes = encodeTlv(tlv)
  const decoded = decodeTlv(bytes)

  assert.equal(decoded.entries.length, 2)
  assert.deepEqual(
    Array.from(decoded.entries[0].value),
    [0x61, 0x00, 0x62, 0x00],
  )
  assert.deepEqual(Array.from(decoded.entries[1].value), [0x00, 0x00])
  assert.equal(decoded.entries[0].tag, 0x01)
  assert.equal(decoded.entries[1].tag, 0x10)
})

test("encodeTlv: writes little-endian length", () => {
  const tlv = Tlv([TlvEntry(0x01, new Uint8Array([1, 2, 3]))])
  const bytes = encodeTlv(tlv)

  assert.deepEqual(Array.from(bytes), [
    0x01, // tag
    0x03,
    0x00,
    0x00,
    0x00, // length = 3, little endian
    0x01,
    0x02,
    0x03, // value
  ])
})

test("decodeTlv: empty input gives empty Tlv", () => {
  const tlv = decodeTlv(new Uint8Array([]))
  assert.deepEqual(tlv.entries, [])
})

test("decodeTlv: truncated header throws", () => {
  assert.throws(() => {
    decodeTlv(new Uint8Array([0x01, 0x00]))
  }, /truncated TLV header/)
})

test("decodeTlv: truncated value throws", () => {
  assert.throws(() => {
    decodeTlv(new Uint8Array([0x01, 0x05, 0x00, 0x00, 0x00, 0x01]))
  }, /truncated TLV value/)
})
