import Path from "path"
import { loadProjectConfig } from "./loadProjectConfig.ts"
import { Project } from "./Project.ts"

export async function loadProject(configFile: string): Promise<Project> {
  const config = await loadProjectConfig(configFile)
  const rootDirectory = Path.resolve(Path.dirname(configFile))
  const project = new Project(rootDirectory, config)
  project.loadSourceFiles()
  return project
}
