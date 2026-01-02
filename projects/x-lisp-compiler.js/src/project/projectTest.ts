import type { Project } from "./index.ts"
import { projectBuild } from "./index.ts"

export function projectTest(project: Project): void {
  projectBuild(project)
}
