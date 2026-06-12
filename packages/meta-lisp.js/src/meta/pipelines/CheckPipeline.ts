import * as M from "../index.ts"

export function CheckPipeline(pkg: M.Package): M.Outcome {
  M.ExpandPass(pkg)
  M.ModulePreludePass(pkg)
  const moduleAnalysisReport = M.ModuleAnalysisPass(pkg)
  let outcome = moduleAnalysisReport.outcome
  const algebraicAnalysisReport = M.AlgebraicAnalysisPass(pkg)
  M.LowerMatchPass(pkg, moduleAnalysisReport, algebraicAnalysisReport)
  M.DesugarPass(pkg)
  M.ModuleImportPass(pkg, moduleAnalysisReport)
  M.SubmitPass(pkg)
  if (M.ClaimPass(pkg) === "OutcomeError") outcome = "OutcomeError"
  M.QualifyPass(pkg)
  if (M.CheckPass(pkg) === "OutcomeError") outcome = "OutcomeError"
  M.LocatePass(pkg)
  return outcome
}
