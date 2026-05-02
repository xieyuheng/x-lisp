import * as M from "../index.ts"

export function projectLoadModFragment(project: M.Project, path: string): void {
  const fragment = M.loadModFragment(path)
  let mod =
    M.projectLookupMod(project, fragment.modName) ||
    M.createMod(fragment.modName, project)

  M.projectAddMod(project, mod)

  if (fragment.isTypeErrorModule) {
    mod.isTypeErrorModule = true
  }

  M.executeStmts(mod, fragment.stmts)
}
