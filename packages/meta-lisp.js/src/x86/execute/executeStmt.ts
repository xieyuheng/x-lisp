import * as S from "@xieyuheng/sexp.js"
import * as N from "../index.ts"

export function executeStmt(mod: N.Mod, stmt: N.Stmt): void {
  switch (stmt.kind) {
    case "DefineCodeStmt": {
      N.modDefine(mod, N.CodeDefinition(stmt.name, stmt.blocks, stmt.location))
      return
    }

    case "DefineDataStmt": {
      const fields = new Map<string, N.Value>()
      for (const field of stmt.fields) {
        fields.set(field.name, N.evaluateExp(mod, field.exp))
      }
      N.modDefine(mod, N.DataDefinition(stmt.name, fields, stmt.location))
      return
    }

    case "DefineMetadataStmt": {
      const fields = new Map<string, N.Value>()
      for (const field of stmt.fields) {
        fields.set(field.name, N.evaluateExp(mod, field.exp))
      }
      N.modDefine(mod, N.MetadataDefinition(stmt.name, fields, stmt.location))
      return
    }

    case "DefineStructStmt": {
      const fields = new Map<string, N.Type>()
      for (const field of stmt.fields) {
        const fieldType = N.evaluateType(mod, field.exp)
        fields.set(field.name, fieldType)
      }
      N.modDefine(mod, N.StructDefinition(stmt.name, fields, stmt.location))
      return
    }

    case "DefineSpaceStmt": {
      const value = N.evaluateExp(mod, stmt.size)
      if (value.kind !== "IntValue") {
        throw new S.ErrorWithSourceLocation(
          `define-space size must be an integer`,
          stmt.size.location,
        )
      }
      N.modDefine(mod, N.SpaceDefinition(stmt.name, value.value, stmt.location))
      return
    }

    case "ClaimStmt": {
      const type = N.evaluateType(mod, stmt.type)
      N.modSetClaimedType(mod, stmt.name, type)
      return
    }

    case "ClaimCodeMetadataStmt": {
      const type = N.evaluateType(mod, stmt.type)
      N.modSetCodeMetadataType(mod, type)
      return
    }
  }
}
