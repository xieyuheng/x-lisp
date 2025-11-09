import fs from "node:fs"
import Path from "node:path"
import { loadProjectConfig, type ProjectConfig } from "./ProjectConfig.ts"

export type Project = {
  rootDirectory: string
  config: ProjectConfig
  sourceFiles: Array<string>
}

export async function loadProject(configFile: string): Promise<Project> {
  const config = await loadProjectConfig(configFile)
  const rootDirectory = Path.resolve(Path.dirname(configFile))
  const sourceDirectory = Path.resolve(
    rootDirectory,
    config["build"]["source-directory"],
  )
  const sourceFiles = fs
    .readdirSync(sourceDirectory, { recursive: true })
    .filter((file) => file.endsWith(".lisp"))
  return {
    rootDirectory,
    config,
    sourceFiles,
  }
}
