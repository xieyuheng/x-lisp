import fs from "node:fs"
import { parseMarkdown } from "../../markdown/index.ts"
import * as M from "../index.ts"
import { loadMarkdownFragment } from "./loadMarkdownFragment.ts"

export function loadMarkdownFragments(path: string): Array<M.Fragment> {
  const code = fs.readFileSync(path, "utf-8")
  const document = parseMarkdown(code, path)
  const defaultModName = document.frontMatter?.get("module")
  const fragments: Array<M.Fragment> = []

  for (const block of document.codeBlocks) {
    const fragment = loadMarkdownFragment(path, block, defaultModName)
    if (fragment !== undefined) {
      fragments.push(fragment)
    }
  }

  return fragments
}
