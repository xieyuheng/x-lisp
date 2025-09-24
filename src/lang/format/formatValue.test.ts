import assert from "node:assert"
import { test } from "node:test"
import * as Values from "../value/index.ts"
import { formatValue } from "./formatValue.ts"

test("formatValue", () => {
  assert.deepStrictEqual(
    "{'c 'b 'a}",
    formatValue(
      Values.Set([Values.Symbol("c"), Values.Symbol("b"), Values.Symbol("a")]),
    ),
  )

  assert.deepStrictEqual(
    "[:c 3 :b 2 :a 1]",
    formatValue(
      Values.Record({
        c: Values.Int(3),
        b: Values.Int(2),
        a: Values.Int(1),
      }),
    ),
  )
})

test("formatValue -- for digest", () => {
  assert.deepStrictEqual(
    "{'a 'b 'c}",
    formatValue(
      Values.Set([Values.Symbol("c"), Values.Symbol("b"), Values.Symbol("a")]),
      { digest: true },
    ),
  )

  assert.deepStrictEqual(
    "[:a 1 :b 2 :c 3]",
    formatValue(
      Values.Record({
        a: Values.Int(1),
        b: Values.Int(2),
        c: Values.Int(3),
      }),
      { digest: true },
    ),
  )
})
