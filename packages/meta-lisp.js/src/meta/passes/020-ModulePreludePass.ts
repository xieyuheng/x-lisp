import { zeroLocation } from "@xieyuheng/sexp.js"
import * as M from "../../meta/index.ts"

export function ModulePreludePass(pkg: M.Package): void {
  for (const fragment of pkg.fragments.values()) {
    for (const [pkgName, modules] of Object.entries(pkg.config.prelude)) {
      for (const modName of modules) {
        fragment.stmts.unshift(
          M.ImportAllStmt(pkgName, modName, zeroLocation(fragment.path)),
        )
      }
    }
  }
}
