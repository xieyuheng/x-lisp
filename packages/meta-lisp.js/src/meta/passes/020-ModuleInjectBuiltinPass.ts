import { zeroLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function ModuleInjectBuiltinPass(pkg: M.Package): void {
  for (const fragment of pkg.fragments.values()) {
    if (fragment.modName !== "builtin") {
      fragment.stmts.unshift(
        M.ImportAllStmt("builtin", zeroLocation(fragment.path)),
      )
    }
  }
}
