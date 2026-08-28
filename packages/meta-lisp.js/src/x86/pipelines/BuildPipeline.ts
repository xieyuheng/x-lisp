import * as X86 from "../index.ts"

export function BuildPipeline(program: X86.Program, stmts: X86.Stmt[]): void {
  X86.SetupPass(program, stmts)
  X86.CheckPass(program)
  X86.ResolveDataOperandsPass(program)
}
