import assert from "node:assert"
import { test } from "node:test"
import { binaryDecode } from "./index.ts"

test("binaryDecode", () => {
  const bytes = new Uint8Array([1, 2, 3])
  const data = binaryDecode(bytes.buffer, [
    ["x", "Uint8"],
    ["y", "Uint8"],
    ["z", "Uint8"],
  ])
  assert.deepEqual(data, { x: 1, y: 2, z: 3 })
})

test("binaryDecode -- DependentSchema", () => {
  const bytes = new Uint8Array([1, 2, 3])
  const data = binaryDecode(bytes.buffer, [
    () => ["x", "Uint8"],
    () => ["y", "Uint8"],
    () => ["z", "Uint8"],
  ])
  assert.deepEqual(data, { x: 1, y: 2, z: 3 })
})
