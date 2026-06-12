import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function executeStmt(mod: X86.Mod, stmt: X86.Stmt): void {
  switch (stmt.kind) {
    case "DefineCodeStmt": {
      X86.modDefine(
        mod,
        X86.CodeDefinition(stmt.name, stmt.blocks, stmt.location),
      )
      return
    }

    case "DefineDataStmt": {
      const env = X86.emptyEnv()
      const fields = X86.evaluateFields(mod, env, stmt.fields)
      X86.modDefine(mod, X86.DataDefinition(stmt.name, fields, stmt.location))
      return
    }

    case "DefineMetadataStmt": {
      const env = X86.emptyEnv()
      const fields = X86.evaluateFields(mod, env, stmt.fields)
      X86.modDefine(
        mod,
        X86.MetadataDefinition(stmt.name, fields, stmt.location),
      )
      return
    }

    case "DefineStructStmt": {
      const paramValues = stmt.parameters.map((p) =>
        X86.TypeValue(X86.VarType(p)),
      )
      const env = X86.envPutMany(
        X86.emptyEnv(),
        stmt.parameters,
        paramValues,
      )
      const fields = X86.evaluateTypeFields(mod, env, stmt.fields)
      X86.modDefine(
        mod,
        X86.StructDefinition(stmt.name, fields, stmt.location),
      )
      const typeCtor: X86.TypeConstructor = {
        mod,
        name: stmt.name,
        parameters: stmt.parameters,
        size: (argTypes) => {
          const structDefinition = mod.definitions.get(stmt.name)
          if (
            structDefinition === undefined ||
            structDefinition.kind !== "StructDefinition"
          ) {
            let message = `[executeStmt] unknown struct: ${stmt.name}`
            throw new Error(message)
          }
          const subst = new Map<string, X86.Type>()
          for (let i = 0; i < stmt.parameters.length; i++) {
            subst.set(stmt.parameters[i], argTypes[i])
          }
          let total = 0
          for (const [, fieldType] of structDefinition.fields) {
            total += X86.typeSize(X86.typeSubst(subst, fieldType))
          }
          return total
        },
      }
      mod.typeConstructors.set(stmt.name, typeCtor)
      return
    }

    case "DefineSpaceStmt": {
      const env = X86.emptyEnv()
      const value = X86.evaluate(mod, env, stmt.size)
      if (value.kind !== "IntValue") {
        let message = `define-space size must be an integer`
        throw new S.ErrorWithSourceLocation(message, stmt.size.location)
      }
      X86.modDefine(
        mod,
        X86.SpaceDefinition(stmt.name, value.value, stmt.location),
      )
      return
    }

    case "ClaimStmt": {
      const env = X86.emptyEnv()
      const type = X86.evaluateType(mod, env, stmt.type)
      X86.modSetClaimedType(mod, stmt.name, type)
      return
    }

    case "ClaimCodeMetadataStmt": {
      const env = X86.emptyEnv()
      const type = X86.evaluateType(mod, env, stmt.type)
      X86.modSetCodeMetadataType(mod, type)
      return
    }
  }
}
