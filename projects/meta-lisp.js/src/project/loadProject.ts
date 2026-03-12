import Path from "node:path"
import { loadProjectConfig } from "./loadProjectConfig.ts"
import { createProject, type Project } from "./Project.ts"

export function loadProject(configPath?: string): Project {
  configPath = configPath || Path.join(process.cwd(), "project.json")
  const config = loadProjectConfig(configPath)
  const rootDirectory = Path.resolve(Path.dirname(configPath))
  return createProject(rootDirectory, config)
}
