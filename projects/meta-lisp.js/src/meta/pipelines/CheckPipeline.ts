import * as M from "../index.ts"

export function CheckPipeline(
  project: M.Project,
  options: {
    dump: boolean
  },
): void {
  M.ExpandPass(project, { dump: options.dump })
  M.DesugarPass(project, { dump: options.dump })
  M.ModulePass(project, { dump: options.dump })
  M.ExecutePass(project, { dump: options.dump })
  M.ClaimPass(project)
  M.LowerMatchPass(project, { dump: options.dump })
  M.QualifyPass(project, { dump: options.dump })
  M.CheckPass(project, { dump: options.dump })
  M.LocatePass(project, { dump: options.dump })
}
