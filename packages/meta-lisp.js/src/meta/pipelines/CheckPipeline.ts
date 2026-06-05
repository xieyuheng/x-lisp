import * as M from "../index.ts"

export function CheckPipeline(rootPkg: M.Package): boolean {
  M.ExpandPass(rootPkg)
  M.ModulePreludePass(rootPkg)
  const analysisResult = M.ModuleAnalysisPass(rootPkg)
  let errorOccurred = analysisResult.errorOccurred
  const algebraicInfo = M.AlgebraicAnalysisPass(rootPkg)
  M.LowerMatchPass(rootPkg, analysisResult, algebraicInfo)
  M.DesugarPass(rootPkg)
  M.ModuleImportPass(rootPkg, analysisResult)
  M.ExecutePass(rootPkg)
  if (M.ClaimPass(rootPkg)) errorOccurred = true
  M.QualifyPass(rootPkg)
  if (M.CheckPass(rootPkg)) errorOccurred = true
  M.LocatePass(rootPkg)
  return errorOccurred
}
