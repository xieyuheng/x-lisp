import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"
import { stageClaim } from "./stageClaim.ts"
import { stageDefine } from "./stageDefine.ts"
import { stageExport } from "./stageExport.ts"
import { stageImport } from "./stageImport.ts"
import { stageSetupVariable } from "./stageSetupVariable.ts"

export function runCode(mod: L.Mod, code: string): void {
  return runSexps(mod, S.parseSexps(code, { url: mod.url }))
}

export function runSexps(mod: L.Mod, sexps: Array<S.Sexp>): void {
  const stmts = sexps.map(L.parseStmt)
  mod.stmts.push(...stmts)

  for (const stmt of stmts) stageDefine(mod, stmt)
  for (const stmt of stmts) stageClaim(mod, stmt)
  for (const stmt of stmts) stageExport(mod, stmt)
  for (const stmt of stmts) stageImport(mod, stmt)

  stageSetupVariable(mod)
}
