import * as X from "@xieyuheng/x-data.js"
import { type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { matchStmt } from "../syntax/index.ts"
import { stage1 } from "./stage1.ts"
import { stage2 } from "./stage2.ts"
import { stage3 } from "./stage3.ts"

export function runCode(mod: Mod, code: string): void {
  return runSexps(mod, X.parseDataArray(code, { url: mod.url }))
}

export function runSexps(mod: Mod, sexps: Array<X.Data>): void {
  const stmts = sexps.map<Stmt>(matchStmt)
  mod.stmts = [...mod.stmts, ...stmts]

  for (const stmt of stmts) stage1(mod, stmt)
  for (const stmt of stmts) stage2(mod, stmt)
  for (const stmt of stmts) stage3(mod, stmt)
}
