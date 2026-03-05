import assert from "node:assert"
import { test } from "node:test"
import { sexpFromJson, sexpToJson } from "../sexp/index.ts"

test("sexpToJson", () => {
  assert.deepStrictEqual("abc", sexpToJson(sexpFromJson("abc")))

  assert.deepStrictEqual(
    ["a", "b", "c"],
    sexpToJson(sexpFromJson(["a", "b", "c"])),
  )

  assert.deepStrictEqual(
    { a: 1, b: 2, c: 3 },
    sexpToJson(sexpFromJson({ a: 1, b: 2, c: 3 })),
  )
})
