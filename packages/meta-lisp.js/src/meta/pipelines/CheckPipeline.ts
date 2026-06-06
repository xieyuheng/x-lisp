import * as M from "../index.ts"

export function CheckPipeline(pkg: M.Package): M.Outcome {
  M.ExpandPass(pkg)
  M.ModulePreludePass(pkg)
  const analysisResult = M.ModuleAnalysisPass(pkg)
  let outcome = analysisResult.outcome
  const algebraicInfo = M.AlgebraicAnalysisPass(pkg)
  M.LowerMatchPass(pkg, analysisResult, algebraicInfo)
  M.DesugarPass(pkg)
  M.ModuleImportPass(pkg, analysisResult)
  M.ExecutePass(pkg)
  if (M.ClaimPass(pkg) === "OutcomeError") outcome = "OutcomeError"
  M.QualifyPass(pkg)
  if (M.CheckPass(pkg) === "OutcomeError") outcome = "OutcomeError"
  M.LocatePass(pkg)
  return outcome
}
