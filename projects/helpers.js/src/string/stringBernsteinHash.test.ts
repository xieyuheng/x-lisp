import { stringBernsteinHash } from "./stringBernsteinHash.ts"
import { test } from "node:test"

function logHash(string: string) {
  console.log({ string, hash: stringBernsteinHash(string) })
}

test("stringBernsteinHash", () => {
  logHash("")
  logHash("a")
  logHash("ab")
  logHash("abc")
  logHash("1")
  logHash("12")
  logHash("123")
})
