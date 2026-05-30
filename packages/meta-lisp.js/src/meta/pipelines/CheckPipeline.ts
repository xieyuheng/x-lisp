import * as M from "../index.ts"

export function CheckPipeline(
  rootPkg: M.Package,
  options: Map<string, string>,
): boolean {
  M.ExpandPass(rootPkg, options)
  M.ModulePreludePass(rootPkg)
  const analysisResult = M.ModuleAnalysisPass(rootPkg)
  let errorOccurred = analysisResult.errorOccurred
  const algebraicInfo = M.AlgebraicAnalysisPass(rootPkg)
  M.LowerMatchPass(rootPkg, analysisResult, algebraicInfo, options)
  M.DesugarPass(rootPkg, options)
  M.ModuleImportPass(rootPkg, analysisResult, options)
  M.ExecutePass(rootPkg, options)
  if (M.ClaimPass(rootPkg)) errorOccurred = true
  M.QualifyPass(rootPkg, options)
  if (M.CheckPass(rootPkg, options)) errorOccurred = true
  M.LocatePass(rootPkg, options)
  return errorOccurred
}
