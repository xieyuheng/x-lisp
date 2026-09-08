import * as X86 from "../index.ts"

export function SetupPass(program: X86.Program, stmts: X86.Stmt[]): void {
  for (const stmt of stmts) {
    setupStmt(program, stmt)
  }
}

function setupStmt(program: X86.Program, stmt: X86.Stmt): void {
  switch (stmt.kind) {
    case "DefineCodeStmt": {
      X86.programDefine(program, X86.CodeDefinition(stmt.name, stmt.instrs))
      break
    }

    case "DefineDataStmt": {
      X86.programDefine(program, X86.DataDefinition(stmt.name, stmt.value))
      break
    }

    case "DefineStructStmt": {
      program.definitions.set(
        stmt.name,
        X86.StructDefinition(stmt.name, stmt.fields),
      )
      break
    }

    case "DefineSpaceStmt": {
      X86.programDefine(program, X86.SpaceDefinition(stmt.name, stmt.size))
      break
    }
  }
}
