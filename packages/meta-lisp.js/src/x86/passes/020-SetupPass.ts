import * as X86 from "../index.ts"

export function SetupPass(mod: X86.Mod, stmts: X86.Stmt[]): void {
  for (const stmt of stmts) {
    setupStmt(mod, stmt)
  }
}

function setupStmt(mod: X86.Mod, stmt: X86.Stmt): void {
  switch (stmt.kind) {
    case "DefineCodeStmt": {
      X86.modDefine(
        mod,
        X86.CodeDefinition(stmt.name, stmt.blocks, stmt.location),
      )
      break
    }

    case "DefineDataStmt": {
      X86.modDefine(
        mod,
        X86.DataDefinition(stmt.name, stmt.value, stmt.location),
      )
      break
    }

    case "DefineMetadataStmt": {
      X86.modDefine(
        mod,
        X86.MetadataDefinition(stmt.name, stmt.value, stmt.location),
      )
      break
    }

    case "DefineStructStmt": {
      mod.definitions.set(
        stmt.name,
        X86.StructDefinition(stmt.name, stmt.fields, stmt.location),
      )
      break
    }

    case "DefineSpaceStmt": {
      X86.modDefine(
        mod,
        X86.SpaceDefinition(stmt.name, stmt.size, stmt.location),
      )
      break
    }
  }
}
