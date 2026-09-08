import * as M from "../index.ts"

export function CheckPipeline(pkg: M.Package): M.Outcome {
  let outcome: M.Outcome = M.CheckReservedNamesPass(pkg)

  M.ExpandPass(pkg)
  M.ModulePreludePass(pkg)

  const moduleReport = M.ModuleAnalysisPass(pkg)
  if (moduleReport.outcome === "OutcomeError") outcome = "OutcomeError"

  const algebraicReport = M.AlgebraicAnalysisPass(pkg)
  M.LowerMatchPass(pkg, moduleReport, algebraicReport)

  M.DesugarPass(pkg)
  M.ModuleImportPass(pkg, moduleReport)
  M.SetupPass(pkg)

  if (M.ClaimPass(pkg) === "OutcomeError") outcome = "OutcomeError"
  M.QualifyPass(pkg)
  M.LocatePass(pkg)

  if (M.CheckPass(pkg) === "OutcomeError") outcome = "OutcomeError"

  return outcome
}
