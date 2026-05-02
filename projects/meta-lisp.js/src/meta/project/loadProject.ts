import Path from "node:path"
import * as M from "../index.ts"

export function loadProject(configPath?: string): M.Project {
  configPath = configPath || Path.join(process.cwd(), "project.json")
  const config = M.loadProjectConfig(configPath)
  const rootDirectory = Path.resolve(Path.dirname(configPath))
  const project = M.createProject(rootDirectory, config)

  M.loadBuiltinMod(project)

  const sourceDirectory = M.projectSourceDirectory(project)
  M.projectLoadModFragments(project, sourceDirectory)

  return project
}
