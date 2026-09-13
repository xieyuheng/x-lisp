import * as S from "@xieyuheng/sexp.js"
import type { MarkdownCodeBlock } from "../../markdown/index.ts"
import * as M from "../index.ts"
import { findModuleDeclarations } from "./findModuleDeclarations.ts"

export function loadMarkdownFragment(
  path: string,
  block: MarkdownCodeBlock,
  defaultModName: string | undefined,
): M.Fragment | undefined {
  if (block.language !== "meta-lisp") return undefined

  const stmts = parseMarkdownBlockStmts(path, block)
  const modName = resolveMarkdownBlockModName(
    path,
    block,
    stmts,
    defaultModName,
  )

  return {
    id: `${path}#block-${block.index}`,
    path,
    blockIndex: block.index,
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

function resolveMarkdownBlockModName(
  path: string,
  block: MarkdownCodeBlock,
  stmts: Array<M.Stmt<M.Exp>>,
  defaultModName: string | undefined,
): string {
  const moduleDeclarations = findModuleDeclarations(stmts)

  if (moduleDeclarations.length > 1) {
    let message = `[loadMarkdownFragment] multiple module declarations in one code block`
    message += `\n  path: ${path}`
    message += `\n  modules: ${moduleDeclarations
      .map((declaration) => declaration.name)
      .join(", ")}`
    throw new S.ErrorWithSourceLocation(message, moduleDeclarations[0].location)
  }

  const explicitModName = moduleDeclarations[0]?.name
  const modName = explicitModName ?? defaultModName

  if (modName === undefined) {
    let message = `[loadMarkdownFragment] expect (module) statement in code block`
    message += `\n  path: ${path}`
    const location =
      stmts[0]?.location ??
      S.createSourceLocation(path, {
        start: block.contentStart,
        end: block.contentStart,
      })
    throw new S.ErrorWithSourceLocation(message, location)
  }

  if (modName === "") {
    let message = `[loadMarkdownFragment] empty module in front matter`
    message += `\n  path: ${path}`
    throw new S.ErrorWithSourceLocation(message, S.zeroLocation(path))
  }

  return modName
}
