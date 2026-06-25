import * as X86 from "../index.ts"

export function BuildPipeline(mod: X86.Mod, stmts: X86.Stmt[]): void {
  X86.SubmitPass(mod, stmts)
  X86.CheckPass(mod)
}
