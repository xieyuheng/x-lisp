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
        c: Values.Int(3n),
        b: Values.Int(2n),
        a: Values.Int(1n),
      }),
    ),
  )

  {
    const hash = Values.Hash()
    Values.hashPut(hash, Values.Symbol("c"), Values.Int(3n))
    Values.hashPut(hash, Values.Symbol("b"), Values.Int(2n))
    Values.hashPut(hash, Values.Symbol("a"), Values.Int(1n))
    assert.deepStrictEqual("(@hash 'c 3 'b 2 'a 1)", formatValue(hash))
  }
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
        a: Values.Int(1n),
        b: Values.Int(2n),
        c: Values.Int(3n),
      }),
      { digest: true },
    ),
  )

  {
    const hash = Values.Hash()
    Values.hashPut(hash, Values.Symbol("c"), Values.Int(3n))
    Values.hashPut(hash, Values.Symbol("b"), Values.Int(2n))
    Values.hashPut(hash, Values.Symbol("a"), Values.Int(1n))
    assert.deepStrictEqual(
      "(@hash 'a 1 'b 2 'c 3)",
      formatValue(hash, { digest: true }),
    )
  }
})
