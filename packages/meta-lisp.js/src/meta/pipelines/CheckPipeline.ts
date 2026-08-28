import * as M from "../index.ts"

export function CheckPipeline(rootPkg: M.Package): M.Outcome {
  const closure = M.packageClosureInTopologicalOrder(rootPkg)

  for (const pkg of closure) M.ExpandPass(pkg)
  for (const pkg of closure) M.ModulePreludePass(pkg)

  const moduleReports = new Map<string, M.ModuleAnalysisReport>()
  let outcome: M.Outcome = "OutcomeOk"
  for (const pkg of closure) {
    const report = M.ModuleAnalysisPass(pkg)
    moduleReports.set(pkg.id, report)
    if (report.outcome === "OutcomeError") outcome = "OutcomeError"
  }

  const algebraicReports = new Map<string, M.AlgebraicAnalysisReport>()
  for (const pkg of closure)
    algebraicReports.set(pkg.id, M.AlgebraicAnalysisPass(pkg))

  for (const pkg of closure)
    M.LowerMatchPass(
      pkg,
      moduleReports.get(pkg.id)!,
      algebraicReports.get(pkg.id)!,
    )

  for (const pkg of closure) M.DesugarPass(pkg)
  for (const pkg of closure) M.ModuleImportPass(pkg, moduleReports.get(pkg.id)!)
  for (const pkg of closure) M.SetupPass(pkg)
  for (const pkg of closure) {
    if (M.ClaimPass(pkg) === "OutcomeError") outcome = "OutcomeError"
  }

  for (const pkg of closure) M.QualifyPass(pkg)
  for (const pkg of closure) M.LocatePass(pkg)

  for (const pkg of closure) {
    if (M.CheckPass(pkg) === "OutcomeError") outcome = "OutcomeError"
  }

  return outcome
}
