import fs from "node:fs"
import Path from "path"
import { loadProjectConfig } from "./loadProjectConfig.ts"
import { projectSourceDirectory, type Project } from "./Project.ts"

export async function loadProject(configFile: string): Promise<Project> {
  const config = await loadProjectConfig(configFile)
  const rootDirectory = Path.resolve(Path.dirname(configFile))
  const project: Project = { rootDirectory, config, sourceFiles: [] }

  project.sourceFiles = fs
    .readdirSync(projectSourceDirectory(project), {
      encoding: "utf8",
      recursive: true,
    })
    .filter((file) => file.endsWith(".lisp"))

  return project
}
