import * as M from "../index.ts"

export function CheckPipeline(pkg: M.Package): boolean {
  M.ExpandPass(pkg)
  M.ModulePreludePass(pkg)
  const analysisResult = M.ModuleAnalysisPass(pkg)
  let errorOccurred = analysisResult.errorOccurred
  const algebraicInfo = M.AlgebraicAnalysisPass(pkg)
  M.LowerMatchPass(pkg, analysisResult, algebraicInfo)
  M.DesugarPass(pkg)
  M.ModuleImportPass(pkg, analysisResult)
  M.ExecutePass(pkg)
  if (M.ClaimPass(pkg)) errorOccurred = true
  M.QualifyPass(pkg)
  if (M.CheckPass(pkg)) errorOccurred = true
  M.LocatePass(pkg)
  return errorOccurred
}
