import { type ProjectConfig } from "./ProjectConfig.ts"

export type Project = {
  rootDirectory: string
  config: ProjectConfig
  sourceIds?: Array<string>
}

export function createProject(
  rootDirectory: string,
  config: ProjectConfig,
): Project {
  return {
    rootDirectory,
    config,
  }
}
