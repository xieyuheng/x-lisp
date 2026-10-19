import fs from "node:fs"

import * as S from "@xieyuheng/sexp.ts"

import { parseMarkdown } from "../../markdown/index.ts"
import type { MarkdownCodeBlock } from "../../markdown/index.ts"
import * as M from "../index.ts"

export function loadMarkdownFragment(path: string): M.Fragment | undefined {
  const code = fs.readFileSync(path, "utf-8")
  const document = parseMarkdown(code, path)
  const blocks = document.codeBlocks.filter(
    (block) => block.language === "meta-lisp",
  )

  if (blocks.length === 0) return undefined

  const stmts = blocks.flatMap((block) => parseMarkdownBlockStmts(path, block))
  const modName = resolveMarkdownModName(
    path,
    blocks[0],
    document.frontMatter?.get("module"),
  )

  return {
    id: path,
    path,
    modName,
    stmts,
    desugaredStmts: [],
  }
}

function parseMarkdownBlockStmts(
  path: string,
  block: MarkdownCodeBlock,
): Array<M.Stmt<M.Exp>> {
  const sexps = S.parseSexps(
    {
      path,
      origin: block.contentStart,
    },
    block.content,
  )

  return sexps.map(M.parseStmt)
}

function resolveMarkdownModName(
  path: string,
  block: MarkdownCodeBlock,
  modName: string | undefined,
): string {
  if (modName === undefined) {
    let message = `[loadMarkdownFragment] expect "module" in front matter`
    message += `\n  path: ${path}`
    const location = S.makeSourceLocation(path, {
      start: block.contentStart,
      end: block.contentStart,
    })
    throw new S.ErrorWithSourceLocation(message, location)
  }

  if (modName === "") {
    let message = `[loadMarkdownFragment] empty module in front matter`
    message += `\n  path: ${path}`
    const location = S.makeSourceLocation(path, {
      start: block.contentStart,
      end: block.contentStart,
    })
    throw new S.ErrorWithSourceLocation(message, location)
  }

  return modName
}
