import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { prepareDefine } from "./prepareDefine.ts"
import { prepareExempt } from "./prepareExempt.ts"
import { prepareImport } from "./prepareImport.ts"

export function prepareCode(mod: M.Mod, code: string): void {
  const sexps = S.parseSexps(code, { path: mod.name })
  const stmts = sexps.map(M.parseStmt)
  mod.stmts.push(...stmts)

  for (const stmt of stmts) prepareDefine(mod, stmt)
  for (const stmt of stmts) prepareExempt(mod, stmt)
  for (const stmt of stmts) prepareImport(mod, stmt)
}
