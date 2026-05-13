import * as M from "../index.ts"

export function ModuleInjectBuiltinPass(project: M.Project): void {
  for (const fragment of project.fragments.values()) {
    if (fragment.modName !== "builtin") {
      fragment.stmts.unshift(M.ImportAll("builtin"))
    }
  }
}
