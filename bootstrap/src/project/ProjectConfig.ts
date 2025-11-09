import fs from "node:fs"
import * as z from "zod"

export type ProjectConfig = {
  name: string
  version: string
  build: {
    "output-directory": string
    "root-directory": string
  }
}

export const ProjectConfigSchema = z.object({
  name: z.string(),
  version: z.string(),
  build: z.object({
    "output-directory": z.string(),
    "root-directory": z.string(),
  }),
})

export async function loadProjectConfig(file: string): Promise<ProjectConfig> {
  const text = await fs.readFileSync(file, "utf8")
  const data = JSON.parse(text)
  return ProjectConfigSchema.parse(data)
}
