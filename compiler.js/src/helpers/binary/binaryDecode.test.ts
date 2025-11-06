import assert from "node:assert"
import { test } from "node:test"
import * as b from "./index.ts"
import { binaryDecode } from "./index.ts"

test("binaryDecode", () => {
  const bytes = new Uint8Array([1, 2, 3])
  const data = b.binaryDecode(
    bytes.buffer,
    b.Sequence([
      b.Attribute("x", b.Uint8()),
      b.Attribute("y", b.Uint8()),
      b.Attribute("z", b.Uint8()),
    ]),
  )
  assert.deepEqual(data, { x: 1, y: 2, z: 3 })
})

test("binaryDecode -- dependent", () => {
  const bytes = new Uint8Array([1, 2, 3])
  const data = binaryDecode(
    bytes.buffer,
    b.Sequence([
      b.Dependent(() => b.Attribute("x", b.Uint8())),
      b.Dependent(() => b.Attribute("y", b.Uint8())),
      b.Dependent(() => b.Attribute("z", b.Uint8())),
    ]),
  )
  assert.deepEqual(data, { x: 1, y: 2, z: 3 })
})
