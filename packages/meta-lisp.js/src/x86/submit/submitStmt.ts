import * as X86 from "../index.ts"

export function submitStmt(mod: X86.Mod, stmt: X86.Stmt): void {
  switch (stmt.kind) {
    case "DefineCodeStmt": {
      X86.modDefine(
        mod,
        X86.CodeDefinition(stmt.name, stmt.blocks, stmt.location),
      )
      return
    }

    case "DefineDataStmt": {
      X86.modDefine(
        mod,
        X86.DataDefinition(stmt.name, stmt.fields, stmt.location),
      )
      return
    }

    case "DefineMetadataStmt": {
      X86.modDefine(
        mod,
        X86.MetadataDefinition(stmt.name, stmt.fields, stmt.location),
      )
      return
    }

    case "DefineStructStmt": {
      X86.modDefine(
        mod,
        X86.StructDefinition(stmt.name, stmt.fields, stmt.location),
      )
      return
    }

    case "DefineSpaceStmt": {
      X86.modDefine(
        mod,
        X86.SpaceDefinition(stmt.name, stmt.size, stmt.location),
      )
      return
    }

    case "ClaimStmt": {
      mod.claimedTypeExps.set(stmt.name, stmt.type)
      return
    }

    case "ClaimCodeMetadataStmt": {
      mod.codeMetadataTypeExp = stmt.type
      return
    }
  }
}
