import * as M from "../index.ts"

export function CheckPipeline(
  project: M.Project,
  options: Map<string, string>,
): void {
  M.ExpandPass(project, options)
  M.ModuleInjectBuiltinPass(project)
  const modInfo = M.ModuleAnalysisPass(project)
  const algebraicInfo = M.AlgebraicAnalysisPass(project)
  M.LowerMatchPass(project, modInfo, algebraicInfo, options)
  M.DesugarPass(project, options)
  M.ModuleImportPass(project, modInfo, options)
  M.ExecutePass(project, options)
  M.ClaimPass(project)
  M.QualifyPass(project, options)
  M.CheckPass(project, options)
  M.LocatePass(project, options)
}
