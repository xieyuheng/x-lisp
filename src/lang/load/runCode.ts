import { type Mod } from "../mod/index.ts"
import { parseStmts } from "../parse/parse.ts"
import { stage1 } from "./stage1.ts"
import { stage2 } from "./stage2.ts"
import { stage3 } from "./stage3.ts"

export function runCode(mod: Mod, code: string): void {
  const stmts = parseStmts(code)

  mod.code = mod.code + code
  mod.stmts = [...mod.stmts, ...stmts]

  for (const stmt of stmts) stage1(mod, stmt)
  for (const stmt of stmts) stage2(mod, stmt)
  for (const stmt of stmts) stage3(mod, stmt)
}
