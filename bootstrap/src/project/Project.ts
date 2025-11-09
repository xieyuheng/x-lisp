import { type ProjectConfig } from "./ProjectConfig.ts"

export type Project = {
  rootDirectory: string
  config: ProjectConfig
  sourceFiles: Array<string>
}
