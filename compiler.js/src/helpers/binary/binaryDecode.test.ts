import assert from "node:assert"
import { test } from "node:test"
import * as b from "./index.ts"
import { binaryDecode } from "./index.ts"

test("binaryDecode", () => {
  const bytes = new Uint8Array([1, 2, 3])
  const data = b.binaryDecode(
    bytes.buffer,
    b.sequence([
      b.attribute("x", b.Uint8()),
      b.attribute("y", b.Uint8()),
      b.attribute("z", b.Uint8()),
    ]),
  )
  assert.deepEqual(data, { x: 1, y: 2, z: 3 })
})

test("binaryDecode -- dependent", () => {
  const bytes = new Uint8Array([1, 2, 3])
  const data = binaryDecode(
    bytes.buffer,
    b.sequence([
      b.dependent(() => b.attribute("x", b.Uint8())),
      b.dependent(() => b.attribute("y", b.Uint8())),
      b.dependent(() => b.attribute("z", b.Uint8())),
    ]),
  )
  assert.deepEqual(data, { x: 1, y: 2, z: 3 })
})
