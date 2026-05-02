import * as M from "../index.ts"

export function projectLoadModFragment(project: M.Project, path: string): void {
  const fragment = M.loadModFragment(path)
  M.projectPutFragment(project, path, fragment)
}
