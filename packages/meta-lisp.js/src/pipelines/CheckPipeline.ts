import * as M from "../meta/index.ts"
import * as Passes from "../passes/index.ts"

export function CheckPipeline(rootPkg: M.Package): M.Outcome {
  const closure = M.packageClosureInTopologicalOrder(rootPkg)

  for (const pkg of closure) Passes.ExpandPass(pkg)
  for (const pkg of closure) Passes.ModulePreludePass(pkg)

  const moduleReports = new Map<string, Passes.ModuleAnalysisReport>()
  let outcome: M.Outcome = "OutcomeOk"
  for (const pkg of closure) {
    const report = Passes.ModuleAnalysisPass(pkg)
    moduleReports.set(pkg.id, report)
    if (report.outcome === "OutcomeError") outcome = "OutcomeError"
  }

  const algebraicReports = new Map<string, Passes.AlgebraicAnalysisReport>()
  for (const pkg of closure)
    algebraicReports.set(pkg.id, Passes.AlgebraicAnalysisPass(pkg))

  for (const pkg of closure)
    Passes.LowerMatchPass(
      pkg,
      moduleReports.get(pkg.id)!,
      algebraicReports.get(pkg.id)!,
    )

  for (const pkg of closure) Passes.DesugarPass(pkg)
  for (const pkg of closure)
    Passes.ModuleImportPass(pkg, moduleReports.get(pkg.id)!)
  for (const pkg of closure) Passes.SetupPass(pkg)
  for (const pkg of closure) {
    if (Passes.ClaimPass(pkg) === "OutcomeError") outcome = "OutcomeError"
  }

  for (const pkg of closure) Passes.QualifyPass(pkg)
  for (const pkg of closure) Passes.LocatePass(pkg)
  for (const pkg of closure) Passes.UniquifyPass(pkg)

  for (const pkg of closure) {
    if (Passes.CheckPass(pkg) === "OutcomeError") outcome = "OutcomeError"
  }

  return outcome
}
