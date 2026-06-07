import * as M from "../index.ts"

export function CheckPipeline(pkg: M.Package): M.Outcome {
  M.ExpandPass(pkg)
  M.ModulePreludePass(pkg)
  const analysisReport = M.ModuleAnalysisPass(pkg)
  let outcome = analysisReport.outcome
  const algebraicReport = M.AlgebraicAnalysisPass(pkg)
  M.LowerMatchPass(pkg, analysisReport, algebraicReport)
  M.DesugarPass(pkg)
  M.ModuleImportPass(pkg, analysisReport)
  M.ExecutePass(pkg)
  if (M.ClaimPass(pkg) === "OutcomeError") outcome = "OutcomeError"
  M.QualifyPass(pkg)
  if (M.CheckPass(pkg) === "OutcomeError") outcome = "OutcomeError"
  M.LocatePass(pkg)
  return outcome
}
