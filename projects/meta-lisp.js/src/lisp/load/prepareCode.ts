import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"
import { performTypeCheck } from "./performTypeCheck.ts"
import { handleDefine as prepareDefine } from "./prepareDefine.ts"
import { handleExempt as prepareExempt } from "./prepareExempt.ts"
import { handleExport as prepareExport } from "./prepareExport.ts"
import { handleImport as prepareImport } from "./prepareImport.ts"
import { setupClaim } from "./setupClaim.ts"

export function prepareCode(mod: L.Mod, code: string): void {
  const sexps = S.parseSexps(code, { url: mod.url })
  const stmts = sexps.map(L.parseStmt)
  mod.stmts.push(...stmts)

  for (const stmt of stmts) prepareDefine(mod, stmt)
  for (const stmt of stmts) prepareExport(mod, stmt)
  for (const stmt of stmts) prepareExempt(mod, stmt)
  for (const stmt of stmts) prepareImport(mod, stmt)

  setupClaim(mod)
  performTypeCheck(mod)
}
