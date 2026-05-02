import * as M from "../index.ts"

export function CheckPipeline(
  project: M.Project,
  options: {
    verbose: boolean
  },
): void {
  M.ExecutePass(project)
  M.ClaimPass(project)
  M.DesugarPass(project)
  M.QualifyPass(project)
  M.LocatePass(project)
  M.CheckPass(project, { verbose: options.verbose })
}
