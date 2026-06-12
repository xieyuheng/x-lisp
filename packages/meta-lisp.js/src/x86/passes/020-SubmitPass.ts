import * as X86 from "../index.ts"

export function SubmitPass(mod: X86.Mod, stmts: X86.Stmt[]): void {
  // Phase 1: register TC shells for structs (for self/recursive references)
  for (const stmt of stmts) {
    if (stmt.kind === "DefineStructStmt") {
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
      mod.typeConstructors.set(stmt.name, typeCtor)
    }
  }

  // Phase 2: register all definitions
  for (const stmt of stmts) {
    X86.submitStmt(mod, stmt)
  }
}
