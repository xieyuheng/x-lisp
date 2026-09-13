import * as S from "@xieyuheng/sexp.js"
import fs from "node:fs"
import { parseMarkdown } from "../../markdown/index.ts"
import * as M from "../index.ts"

export function loadMarkdownFragments(path: string): Array<M.Fragment> {
  const code = fs.readFileSync(path, "utf-8")
  const document = parseMarkdown(code, path)
  const fragments: Array<M.Fragment> = []

  for (const block of document.codeBlocks) {
    if (block.language !== "meta-lisp") continue

    const sexps = S.parseSexps(block.content, {
      path,
      origin: block.contentStart,
    })
    const stmts = sexps.map(M.parseStmt)
    const modName = findModName(path, block.contentStart, stmts)

    fragments.push({
      id: `${path}#block-${block.index}`,
      path,
      blockIndex: block.index,
      modName,
      stmts,
      desugaredStmts: [],
    })
  }

  return fragments
}

function findModName(
  path: string,
  contentStart: S.Position,
  stmts: Array<M.Stmt<M.Exp>>,
): string {
  const moduleStmts: Array<{ name: string; location: S.SourceLocation }> = []
  for (const stmt of stmts) {
    if (stmt.kind === "DeclareModuleStmt") {
      moduleStmts.push({ name: stmt.name, location: stmt.location })
    }
  }

  if (moduleStmts.length === 0) {
    let message = `[loadMarkdownFragments] expect (module) statement in code block`
    message += `\n  path: ${path}`
    const location =
      stmts[0]?.location ??
      S.createSourceLocation(path, {
        start: contentStart,
        end: contentStart,
      })
    throw new S.ErrorWithSourceLocation(message, location)
  }

  const uniqueNames = new Set(moduleStmts.map((stmt) => stmt.name))
  if (uniqueNames.size > 1) {
    let message = `[loadMarkdownFragments] multiple module declarations in one code block`
    message += `\n  path: ${path}`
    message += `\n  modules: ${Array.from(uniqueNames).join(", ")}`
    throw new S.ErrorWithSourceLocation(message, moduleStmts[0].location)
  }

  return moduleStmts[0].name
}
