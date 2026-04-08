import * as M from "../index.ts"

export function projectCheck(project: M.Project): void {
  for (const id of M.projectSourceIds(project)) {
    const path = M.projectGetSourcePath(project, id)
    M.loadCode(project, path)
  }

  M.projectForEachDefinition(project, M.definitionDesugar)
  M.projectForEachDefinition(project, M.definitionCheck)
}
