import fs from "node:fs"
import { type ProjectConfig, ProjectConfigSchema } from "./ProjectConfig.ts"

export function loadProjectConfig(file: string): ProjectConfig {
  const text = fs.readFileSync(file, "utf8")
  const data = JSON.parse(text)
  return ProjectConfigSchema.parse(data)
}
