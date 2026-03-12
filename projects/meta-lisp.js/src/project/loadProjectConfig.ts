import {
  callWithFile,
  fileOpenForRead,
  fileRead,
} from "@xieyuheng/helpers.js/file"
import { type ProjectConfig, ProjectConfigSchema } from "./ProjectConfig.ts"

export function loadProjectConfig(file: string): ProjectConfig {
  return callWithFile(fileOpenForRead(file), (file) => {
    const text = fileRead(file)
    const data = JSON.parse(text)
    return ProjectConfigSchema.parse(data)
  })
}
