import assert from "node:assert"
import { test } from "node:test"
import * as Bin from "./index.ts"

test("decode", () => {
  const bytes = new Uint8Array([1, 2, 3])
  const data = Bin.decode(
    bytes.buffer,
    Bin.Sequence([
      Bin.Attribute("x", Bin.Uint8()),
      Bin.Attribute("y", Bin.Uint8()),
      Bin.Attribute("z", Bin.Uint8()),
    ]),
  )
  assert.deepEqual(data, { x: 1, y: 2, z: 3 })
})

test("decode -- dependent", () => {
  const bytes = new Uint8Array([1, 2, 3])
  const data = Bin.decode(
    bytes.buffer,
    Bin.Sequence([
      Bin.Dependent(() => Bin.Attribute("x", Bin.Uint8())),
      Bin.Dependent(() => Bin.Attribute("y", Bin.Uint8())),
      Bin.Dependent(() => Bin.Attribute("z", Bin.Uint8())),
    ]),
  )
  assert.deepEqual(data, { x: 1, y: 2, z: 3 })
})
