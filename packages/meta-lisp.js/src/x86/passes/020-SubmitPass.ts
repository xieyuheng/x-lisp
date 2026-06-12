import * as X86 from "../index.ts"

export function SubmitPass(mod: X86.Mod, stmts: X86.Stmt[]): void {
  for (const stmt of stmts) {
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
          X86.DataDefinition(stmt.name, stmt.fields, stmt.location),
        )
        break
      }

      case "DefineMetadataStmt": {
        X86.modDefine(
          mod,
          X86.MetadataDefinition(stmt.name, stmt.fields, stmt.location),
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
              throw new Error(message)
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

      case "ClaimStmt": {
        mod.claimedTypeExps.set(stmt.name, stmt.type)
        break
      }

      case "ClaimCodeMetadataStmt": {
        mod.codeMetadataTypeExp = stmt.type
        break
      }
    }
  }
}
