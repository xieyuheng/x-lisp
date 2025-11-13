import Path from "node:path"
import { loadProjectConfig } from "./loadProjectConfig.ts"
import { Project } from "./Project.ts"

export async function loadProject(configFile?: string): Promise<Project> {
  configFile = configFile || Path.join(process.cwd(), "project.json")
  const config = await loadProjectConfig(configFile)
  const rootDirectory = Path.resolve(Path.dirname(configFile))
  return new Project(rootDirectory, config)
}
