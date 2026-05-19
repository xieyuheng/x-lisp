import * as M from "../index.ts"
import { zeroLocation } from "@xieyuheng/sexp.js"

export function ModuleInjectBuiltinPass(project: M.Project): void {
  for (const fragment of project.fragments.values()) {
    if (fragment.modName !== "builtin") {
      fragment.stmts.unshift(
        M.ImportAll("builtin", zeroLocation(fragment.path)),
      )
    }
  }
}