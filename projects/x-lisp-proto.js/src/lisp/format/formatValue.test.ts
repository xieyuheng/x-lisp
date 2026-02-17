import assert from "node:assert"
import { test } from "node:test"
import * as Values from "../value/index.ts"
import { formatValue } from "./formatValue.ts"

test("formatValue", () => {
  assert.deepStrictEqual(
    "{'c 'b 'a}",
    formatValue(
      Values.SetValue([
        Values.SymbolValue("c"),
        Values.SymbolValue("b"),
        Values.SymbolValue("a"),
      ]),
    ),
  )

  assert.deepStrictEqual(
    "[:c 3 :b 2 :a 1]",
    formatValue(
      Values.RecordValue({
        c: Values.IntValue(3n),
        b: Values.IntValue(2n),
        a: Values.IntValue(1n),
      }),
    ),
  )

  {
    const hash = Values.HashValue()
    Values.hashPut(hash, Values.SymbolValue("c"), Values.IntValue(3n))
    Values.hashPut(hash, Values.SymbolValue("b"), Values.IntValue(2n))
    Values.hashPut(hash, Values.SymbolValue("a"), Values.IntValue(1n))
    assert.deepStrictEqual("(@hash 'c 3 'b 2 'a 1)", formatValue(hash))
  }
})

test("formatValue -- for digest", () => {
  assert.deepStrictEqual(
    "{'a 'b 'c}",
    formatValue(
      Values.SetValue([
        Values.SymbolValue("c"),
        Values.SymbolValue("b"),
        Values.SymbolValue("a"),
      ]),
      { digest: true },
    ),
  )

  assert.deepStrictEqual(
    "[:a 1 :b 2 :c 3]",
    formatValue(
      Values.RecordValue({
        a: Values.IntValue(1n),
        b: Values.IntValue(2n),
        c: Values.IntValue(3n),
      }),
      { digest: true },
    ),
  )

  {
    const hash = Values.HashValue()
    Values.hashPut(hash, Values.SymbolValue("c"), Values.IntValue(3n))
    Values.hashPut(hash, Values.SymbolValue("b"), Values.IntValue(2n))
    Values.hashPut(hash, Values.SymbolValue("a"), Values.IntValue(1n))
    assert.deepStrictEqual(
      "(@hash 'a 1 'b 2 'c 3)",
      formatValue(hash, { digest: true }),
    )
  }
})
