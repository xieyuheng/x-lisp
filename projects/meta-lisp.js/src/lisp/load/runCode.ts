import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"
import { handleDefine } from "./handleDefine.ts"
import { handleExempt } from "./handleExempt.ts"
import { handleExport } from "./handleExport.ts"
import { handleImport } from "./handleImport.ts"
import { performTypeCheck } from "./performTypeCheck.ts"
import { setupClaim } from "./setupClaim.ts"
import { setupVariable } from "./setupVariable.ts"

export function runCode(mod: L.Mod, code: string): void {
  const sexps = S.parseSexps(code, { url: mod.url })
  const stmts = sexps.map(L.parseStmt)
  mod.stmts.push(...stmts)

  for (const stmt of stmts) handleDefine(mod, stmt)
  for (const stmt of stmts) handleExport(mod, stmt)
  for (const stmt of stmts) handleExempt(mod, stmt)
  for (const stmt of stmts) handleImport(mod, stmt)

  setupVariable(mod)
  setupClaim(mod)
  performTypeCheck(mod)
}
