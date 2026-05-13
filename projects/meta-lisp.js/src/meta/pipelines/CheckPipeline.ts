import * as M from "../index.ts"

export function CheckPipeline(
  project: M.Project,
  options: {
    verbose: boolean
    dump: boolean
  },
): void {
  M.ExpandPass(project)
  M.ModuleInjectBuiltinPass(project)
  const modInfo = M.ModuleAnalysisPass(project)
  M.ModuleImportPass(project, modInfo)
  M.ExecutePass(project)
  M.ClaimPass(project)
  M.DesugarPass(project, { dump: options.dump })
  M.QualifyPass(project, { dump: options.dump })
  // - CheckPass still need to handle unqualified Var,
  //   which is used by by inferring type of recursive function.
  M.CheckPass(project, { verbose: options.verbose, dump: options.dump })
  M.LocatePass(project, { dump: options.dump })
}
