import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export function SubmitPass(mod: X86.Mod, stmts: X86.Stmt[]): void {
  for (const stmt of stmts) {
    submitStmt(mod, stmt)
  }
}

function submitStmt(mod: X86.Mod, stmt: X86.Stmt): void {
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
            let message = `[SubmitPass] unknown struct: ${stmt.name}`
            throw new S.ErrorWithSourceLocation(message, stmt.location)
          }
          const env = X86.envPutMany(
            X86.emptyEnv(),
            stmt.parameters,
            argTypes.map((t) => X86.TypeValue(t)),
          )
          let total = 0
          for (const field of structDefinition.fields) {
            total += X86.typeSize(X86.evaluateType(mod, env, field.exp))
          }
          return total
        },
      }
      mod.definitions.set(
        stmt.name,
        X86.StructDefinition(stmt.name, typeCtor, stmt.fields, stmt.location),
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
