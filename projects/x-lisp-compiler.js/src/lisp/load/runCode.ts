import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"
import { handleDefine } from "./handleDefine.ts"
import { handleExport } from "./handleExport.ts"
import { handleImport } from "./handleImport.ts"
import { setupType } from "./setupType.ts"
import { setupVariable } from "./setupVariable.ts"
import { setupClaim } from "./setupClaim.ts"

export function runCode(mod: L.Mod, code: string): void {
  return runSexps(mod, S.parseSexps(code, { url: mod.url }))
}

export function runSexps(mod: L.Mod, sexps: Array<S.Sexp>): void {
  const stmts = sexps.map(L.parseStmt)
  mod.stmts.push(...stmts)

  for (const stmt of stmts) handleDefine(mod, stmt)
  for (const stmt of stmts) handleExport(mod, stmt)
  for (const stmt of stmts) handleImport(mod, stmt)

  setupType(mod)
  setupVariable(mod)
  setupClaim(mod)
}
