import * as M from "../index.ts"

export function ExpandPass(project: M.Project): void {
  for (const [path, fragment] of project.fragments) {
    let mod =
      M.projectLookupMod(project, fragment.modName) ||
      M.createMod(fragment.modName, project)

    M.projectAddMod(project, mod)

    if (fragment.isTypeErrorModule) {
      mod.isTypeErrorModule = true
    }

    M.executeStmts(mod, fragment.stmts)
  }
}
