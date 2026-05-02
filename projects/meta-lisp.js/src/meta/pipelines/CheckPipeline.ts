import * as M from "../index.ts"

export function CheckPipeline(
  project: M.Project,
  options: {
    verbose: boolean
  },
): void {
  M.projectForEachMod(project, M.ClaimPass)
  M.projectForEachMod(project, M.DesugarPass)
  M.projectForEachMod(project, M.QualifyPass)
  M.projectForEachMod(project, M.LocatePass)
  M.projectForEachMod(project, (mod) =>
    M.CheckPass(mod, { verbose: options.verbose }),
  )
}
