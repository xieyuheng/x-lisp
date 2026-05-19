import assert from "node:assert"
import { test } from "node:test"
import { stringBernsteinHash } from "./stringBernsteinHash.ts"

test("stringBernsteinHash", () => {
  assert.strictEqual(stringBernsteinHash(""), 0)
  assert.strictEqual(stringBernsteinHash("a"), 97)
  assert.strictEqual(stringBernsteinHash("ab"), 3299)
  assert.strictEqual(stringBernsteinHash("abc"), 108832)
  assert.strictEqual(stringBernsteinHash("1"), 49)
  assert.strictEqual(stringBernsteinHash("12"), 1635)
  assert.strictEqual(stringBernsteinHash("123"), 54000)
})
