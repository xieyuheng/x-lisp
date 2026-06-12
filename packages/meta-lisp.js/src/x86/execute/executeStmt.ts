import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function executeStmt(mod: X86.Mod, stmt: X86.Stmt): void {
  switch (stmt.kind) {
    case "DefineCodeStmt": {
      X86.modDefine(mod, X86.CodeDefinition(stmt.name, stmt.blocks, stmt.location))
      return
    }

    case "DefineDataStmt": {
      const fields = new Map<string, X86.Value>()
      for (const field of stmt.fields) {
        fields.set(field.name, X86.evaluate(mod, field.exp))
      }
      X86.modDefine(mod, X86.DataDefinition(stmt.name, fields, stmt.location))
      return
    }

    case "DefineMetadataStmt": {
      const fields = new Map<string, X86.Value>()
      for (const field of stmt.fields) {
        fields.set(field.name, X86.evaluate(mod, field.exp))
      }
      X86.modDefine(mod, X86.MetadataDefinition(stmt.name, fields, stmt.location))
      return
    }

    case "DefineStructStmt": {
      const fields = new Map<string, X86.Type>()
      for (const field of stmt.fields) {
        const fieldType = X86.evaluateType(mod, field.exp)
        fields.set(field.name, fieldType)
      }
      X86.modDefine(mod, X86.StructDefinition(stmt.name, fields, stmt.location))
      return
    }

    case "DefineSpaceStmt": {
      const value = X86.evaluate(mod, stmt.size)
      if (value.kind !== "IntValue") {
        throw new S.ErrorWithSourceLocation(
          `define-space size must be an integer`,
          stmt.size.location,
        )
      }
      X86.modDefine(mod, X86.SpaceDefinition(stmt.name, value.value, stmt.location))
      return
    }

    case "ClaimStmt": {
      const type = X86.evaluateType(mod, stmt.type)
      X86.modSetClaimedType(mod, stmt.name, type)
      return
    }

    case "ClaimCodeMetadataStmt": {
      const type = X86.evaluateType(mod, stmt.type)
      X86.modSetCodeMetadataType(mod, type)
      return
    }
  }
}
