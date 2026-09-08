import * as M from "../index.ts"

export function CorePipeline(pkg: M.Package): void {
  M.UniquifyPass(pkg)
  M.ConvertClosurePass(pkg)
  M.LimitArityPass(pkg, 6)
  M.UnnestOperandPass(pkg)
}
