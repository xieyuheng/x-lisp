import assert from "node:assert"
import { test } from "node:test"
import * as S from "../sexp/index.ts"
import { sexpFromJson } from "../sexp/index.ts"

test("sexpFromJson", () => {
  assert.deepStrictEqual(sexpFromJson("abc"), S.String("abc"))

  assert.deepStrictEqual(
    sexpFromJson(["a", "b", "c"]),
    S.Tael([S.String("a"), S.String("b"), S.String("c")], {}),
  )

  assert.deepStrictEqual(
    sexpFromJson({ a: 1, b: 2, c: 3 }),
    S.Record({
      a: S.Int(1n),
      b: S.Int(2n),
      c: S.Int(3n),
    }),
  )
})
