import * as M from "../index.ts"

export function ModuleInjectBuiltinPass(project: M.Project): void {
  for (const fragment of project.fragments.values()) {
    if (fragment.modName !== "builtin") {
      const moduleStmt = fragment.stmts.find(
        (s) => s.kind === "DeclareModule" || s.kind === "DeclareErrorModule",
      )
      if (moduleStmt === undefined) {
        throw new Error(
          `[ModuleInjectBuiltinPass] missing module declaration in fragment: ${fragment.modName}`,
        )
      }
      fragment.stmts.unshift(M.ImportAll("builtin", moduleStmt.location))
    }
  }
}
