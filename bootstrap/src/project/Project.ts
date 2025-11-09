import Path from "path"
import { type ProjectConfig } from "./ProjectConfig.ts"

export type Project = {
  rootDirectory: string
  config: ProjectConfig
  sourceFiles: Array<string>
}

export function projectSourceDirectory(project: Project): string {
  return Path.resolve(
    project.rootDirectory,
    project.config["build"]["source-directory"],
  )
}

export function projectOutputDirectory(project: Project): string {
  return Path.resolve(
    project.rootDirectory,
    project.config["build"]["output-directory"],
  )
}
