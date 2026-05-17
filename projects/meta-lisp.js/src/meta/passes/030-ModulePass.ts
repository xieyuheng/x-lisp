import * as M from "../index.ts"

export function ModulePass(
  project: M.Project,
  options: { dump: boolean },
): void {
  M.ModuleInjectBuiltinPass(project)
  const modInfo = M.ModuleAnalysisPass(project)
  M.ModuleImportPass(project, modInfo)

  if (options.dump) M.projectDumpFragments(project, "030-module")
}
