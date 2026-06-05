import { zeroLocation } from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function ModulePreludePass(pkg: M.Package): void {
  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const fragment of orderedPkg.fragments.values()) {
      for (const [pkgName, modules] of Object.entries(
        orderedPkg.config.prelude,
      )) {
        for (const modName of modules) {
          fragment.stmts.unshift(
            M.ImportAllStmt(pkgName, modName, zeroLocation(fragment.path)),
          )
        }
      }
    }
  }
}
