import * as M from "../index.ts"

export function CheckPipeline(
  pkg: M.Package,
  options: Map<string, string>,
): void {
  M.ExpandPass(pkg, options)
  M.ModuleInjectBuiltinPass(pkg)
  const modInfo = M.ModuleAnalysisPass(pkg)
  const algebraicInfo = M.AlgebraicAnalysisPass(pkg)
  M.LowerMatchPass(pkg, modInfo, algebraicInfo, options)
  M.DesugarPass(pkg, options)
  M.ModuleImportPass(pkg, modInfo, options)
  M.ExecutePass(pkg, options)
  M.ClaimPass(pkg)
  M.QualifyPass(pkg, options)
  M.CheckPass(pkg, options)
  M.LocatePass(pkg, options)
}
