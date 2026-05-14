import * as M from "../index.ts"

export function ModulePass(project: M.Project): void {
  M.ModuleInjectBuiltinPass(project)
  const modInfo = M.ModuleAnalysisPass(project)
  M.ModuleImportPass(project, modInfo)
}
