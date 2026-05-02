import * as M from "../index.ts"

export function CheckPipeline(
  project: M.Project,
  options: {
    verbose: boolean
    dump: boolean
  },
): void {
  M.ExecutePass(project)
  M.ClaimPass(project, { dump: options.dump })
  M.DesugarPass(project, { dump: options.dump })
  M.QualifyPass(project, { dump: options.dump })
  M.LocatePass(project, { dump: options.dump })
  M.CheckPass(project, { verbose: options.verbose, dump: options.dump })
}
