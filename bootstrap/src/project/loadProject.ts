import fs from "node:fs"
import Path from "path"
import { loadProjectConfig } from "./loadProjectConfig.ts"
import { Project } from "./Project.ts"

export async function loadProject(configFile: string): Promise<Project> {
  const config = await loadProjectConfig(configFile)
  const rootDirectory = Path.resolve(Path.dirname(configFile))
  const project = new Project(rootDirectory, config)
  project.sourceFiles = fs
    .readdirSync(project.sourceDirectory(), {
      encoding: "utf8",
      recursive: true,
    })
    .filter((file) => file.endsWith(".lisp"))

  return project
}
