import assert from "node:assert/strict"
import { test } from "node:test"
import { parseFrontMatterKv } from "./parseFrontMatterKv.ts"

test("front matter -- simple key value", () => {
  const entries = parseFrontMatterKv("module: lambda\ntitle: interpreter\n")

  assert.deepEqual(Array.from(entries), [
    ["module", "lambda"],
    ["title", "interpreter"],
  ])
})

test("front matter -- double quoted value", () => {
  const entries = parseFrontMatterKv('module: "lambda"\n')

  assert.equal(entries.get("module"), "lambda")
})

test("front matter -- single quoted value", () => {
  const entries = parseFrontMatterKv("module: 'lambda'\n")

  assert.equal(entries.get("module"), "lambda")
})

test("front matter -- last duplicate key wins", () => {
  const entries = parseFrontMatterKv("module: a\nmodule: b\n")

  assert.equal(entries.get("module"), "b")
})

test("front matter -- indented and unsupported lines are ignored", () => {
  const entries = parseFrontMatterKv(
    ["module: lambda", "  nested: value", "plain text"].join("\n"),
  )

  assert.deepEqual(Array.from(entries), [["module", "lambda"]])
})

test("front matter -- empty raw", () => {
  const entries = parseFrontMatterKv("")

  assert.equal(entries.size, 0)
})
