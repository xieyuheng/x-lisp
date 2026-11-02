import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { test } from "node:test"

import { loadMarkdownFragment } from "../meta/fragment/loadMarkdownFragment.ts"

function withMarkdownFile(
  text: string,
  callback: (file: string) => void,
): void {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "meta-lisp-"))
  const file = path.join(directory, "test.md")

  try {
    fs.writeFileSync(file, text)
    callback(file)
  } finally {
    fs.rmSync(directory, { recursive: true, force: true })
  }
}

test("skip tag prevents a meta-lisp code block from being collected", () => {
  const text = [
    "---",
    "module: test",
    "---",
    "",
    "```meta-lisp skip",
    "(this is not valid code)",
    "```",
    "",
  ].join("\n")

  withMarkdownFile(text, (file) => {
    assert.equal(loadMarkdownFragment(file), undefined)
  })
})

test("other info words do not prevent collection", () => {
  const text = [
    "---",
    "module: test",
    "---",
    "",
    "```meta-lisp title=foo",
    "(define x 1)",
    "```",
    "",
  ].join("\n")

  withMarkdownFile(text, (file) => {
    const fragment = loadMarkdownFragment(file)
    assert.ok(fragment)
    assert.equal(fragment.modName, "test")
  })
})
