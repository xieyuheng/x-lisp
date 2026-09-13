import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert/strict"
import { test } from "node:test"
import { parseMarkdown } from "./parseMarkdown.ts"

const path = "test.md"

test("empty document", () => {
  const document = parseMarkdown("", path)
  assert.equal(document.frontMatter, undefined)
  assert.deepEqual(document.codeBlocks, [])
})

test("single meta-lisp code block", () => {
  const text = "```meta-lisp\n(module foo)\n```\n"
  const document = parseMarkdown(text, path)
  const block = document.codeBlocks[0]

  assert.equal(document.frontMatter, undefined)
  assert.equal(document.codeBlocks.length, 1)
  assert.equal(block.index, 0)
  assert.equal(block.info, "meta-lisp")
  assert.equal(block.language, "meta-lisp")
  assert.equal(block.content, "(module foo)\n")
  assert.deepEqual(block.contentStart, {
    index: text.indexOf("(module foo)"),
    row: 1,
    column: 0,
  })
})

test("front matter is parsed as yaml", () => {
  const text = [
    "---",
    "title: Test",
    "list:",
    "  - a",
    "  - b",
    "---",
    "",
    "```meta-lisp",
    "(module foo)",
    "```",
    "",
  ].join("\n")

  const document = parseMarkdown(text, path)
  assert.ok(document.frontMatter)
  assert.deepEqual(document.frontMatter.data, {
    title: "Test",
    list: ["a", "b"],
  })
  assert.equal(document.frontMatter.raw, "title: Test\nlist:\n  - a\n  - b\n")
  assert.equal(document.codeBlocks.length, 1)
  assert.deepEqual(document.codeBlocks[0].contentStart, {
    index: text.indexOf("(module foo)"),
    row: 8,
    column: 0,
  })
})

test("multiple code blocks and non meta-lisp language", () => {
  const text = [
    "```meta-lisp",
    "(a)",
    "```",
    "",
    "paragraph",
    "",
    "```scheme",
    "(b)",
    "```",
    "",
    "~~~meta-lisp",
    "(c)",
    "~~~",
    "",
  ].join("\n")

  const document = parseMarkdown(text, path)
  assert.equal(document.codeBlocks.length, 3)
  assert.deepEqual(
    document.codeBlocks.map((block) => block.language),
    ["meta-lisp", "scheme", "meta-lisp"],
  )
  assert.deepEqual(
    document.codeBlocks.map((block) => block.content),
    ["(a)\n", "(b)\n", "(c)\n"],
  )
})

test("info string keeps language and extra attributes", () => {
  const text = "```meta-lisp title=foo\n(module foo)\n```\n"
  const document = parseMarkdown(text, path)
  const block = document.codeBlocks[0]

  assert.equal(block.info, "meta-lisp title=foo")
  assert.equal(block.language, "meta-lisp")
  assert.equal(block.content, "(module foo)\n")
})

test("backtick content can contain tilde fences", () => {
  const text = "````meta-lisp\n```\n~~~~\n````\n"
  const document = parseMarkdown(text, path)
  const block = document.codeBlocks[0]

  assert.equal(block.language, "meta-lisp")
  assert.equal(block.content, "```\n~~~~\n")
})

test("short fence does not close a long fence", () => {
  const text = "```\n(a)\n``\n```\n"
  const document = parseMarkdown(text, path)
  const block = document.codeBlocks[0]

  assert.equal(block.content, "(a)\n``\n")
})

test("closing fence may be indented up to three spaces", () => {
  const text = "```\n(a)\n   ```   \n"
  const document = parseMarkdown(text, path)
  const block = document.codeBlocks[0]

  assert.equal(block.content, "(a)\n")
})

test("four-space indented fence does not close a code block", () => {
  const text = "```\n(a)\n    ```\n```\n"
  const document = parseMarkdown(text, path)
  const block = document.codeBlocks[0]

  assert.equal(block.content, "(a)\n    ```\n")
})

test("unclosed fence reports the opening fence location", () => {
  const text = "```meta-lisp\n(module foo)\n"

  assert.throws(
    () => parseMarkdown(text, path),
    (error: unknown) => {
      assert.ok(error instanceof S.ErrorWithSourceLocation)
      assert.deepEqual(error.location.span.start, {
        index: 0,
        row: 0,
        column: 0,
      })
      assert.deepEqual(error.location.span.end, {
        index: 12,
        row: 0,
        column: 12,
      })
      return true
    },
  )
})

test("invalid yaml reports the front matter location", () => {
  const text = "---\na: [1,\n---\n"

  assert.throws(
    () => parseMarkdown(text, path),
    (error: unknown) => {
      assert.ok(error instanceof S.ErrorWithSourceLocation)
      assert.equal(error.location.span.start.row, 0)
      assert.equal(error.location.span.start.column, 0)
      return true
    },
  )
})

test("unclosed front matter is not treated as front matter", () => {
  const text = "---\n\n```meta-lisp\n(module foo)\n```\n"
  const document = parseMarkdown(text, path)

  assert.equal(document.frontMatter, undefined)
  assert.equal(document.codeBlocks.length, 1)
})

test("crlf line endings are preserved in code block content", () => {
  const text =
    "---\r\ntitle: T\r\n---\r\n\r\n```meta-lisp\r\n(module foo)\r\n```\r\n"
  const document = parseMarkdown(text, path)

  assert.ok(document.frontMatter)
  assert.deepEqual(document.frontMatter.data, { title: "T" })
  assert.equal(document.codeBlocks[0].content, "(module foo)\r\n")
  assert.deepEqual(document.codeBlocks[0].contentStart, {
    index: text.indexOf("(module foo)"),
    row: 5,
    column: 0,
  })
})

test("unicode code points before a code block do not shift position index", () => {
  const text = "😀\n```meta-lisp\n(module foo)\n```\n"
  const document = parseMarkdown(text, path)
  const block = document.codeBlocks[0]
  const contentStartCursor = text.indexOf("(module foo)")
  const expectedIndex = [...text.slice(0, contentStartCursor)].length

  assert.equal(block.contentStart.index, expectedIndex)
  assert.equal(block.contentStart.row, 2)
  assert.equal(block.contentStart.column, 0)
})

test("front matter may end with three dots", () => {
  const text = "---\ntitle: Test\n...\n```meta-lisp\n(module foo)\n```\n"
  const document = parseMarkdown(text, path)

  assert.ok(document.frontMatter)
  assert.deepEqual(document.frontMatter.data, { title: "Test" })
  assert.equal(document.codeBlocks.length, 1)
})

test("empty front matter has undefined data", () => {
  const text = "---\n---\n"
  const document = parseMarkdown(text, path)

  assert.ok(document.frontMatter)
  assert.equal(document.frontMatter.data, undefined)
  assert.equal(document.codeBlocks.length, 0)
})

test("code block without info has undefined language", () => {
  const text = "```\n(a)\n```\n"
  const document = parseMarkdown(text, path)
  const block = document.codeBlocks[0]

  assert.equal(block.info, "")
  assert.equal(block.language, undefined)
  assert.equal(block.content, "(a)\n")
})
