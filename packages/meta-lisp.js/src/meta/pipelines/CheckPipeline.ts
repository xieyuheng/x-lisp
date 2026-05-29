import * as M from "../index.ts"

export function CheckPipeline(
  rootPkg: M.Package,
  options: Map<string, string>,
): void {
  M.ExpandPass(rootPkg, options)
  M.ModulePreludePass(rootPkg)
  const modInfo = M.ModuleAnalysisPass(rootPkg)
  const algebraicInfo = M.AlgebraicAnalysisPass(rootPkg)
  M.LowerMatchPass(rootPkg, modInfo, algebraicInfo, options)
  M.DesugarPass(rootPkg, options)
  M.ModuleImportPass(rootPkg, modInfo, options)
  M.ExecutePass(rootPkg, options)
  M.ClaimPass(rootPkg)
  M.QualifyPass(rootPkg, options)
  M.CheckPass(rootPkg, options)
  M.LocatePass(rootPkg, options)
}
