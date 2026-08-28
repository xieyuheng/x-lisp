import * as M from "../index.ts"

export function CorePipeline(rootPkg: M.Package): M.Outcome {
  const outcome = M.CheckPipeline(rootPkg)

  const closure = M.packageClosureInTopologicalOrder(rootPkg)
  for (const pkg of closure) M.UniquifyPass(pkg)
  for (const pkg of closure) M.ConvertClosurePass(pkg)
  for (const pkg of closure) M.LimitArityPass(pkg, 6)
  for (const pkg of closure) M.UnnestOperandPass(pkg)

  return outcome
}
