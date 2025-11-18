import Path from "node:path"
import { loadProjectConfig } from "./loadProjectConfig.ts"
import { createProject, type Project } from "./Project.ts"

export function loadProject(configFile?: string): Project {
  configFile = configFile || Path.join(process.cwd(), "project.json")
  const config = loadProjectConfig(configFile)
  const rootDirectory = Path.resolve(Path.dirname(configFile))
  return createProject(rootDirectory, config)
}
