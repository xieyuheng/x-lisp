import * as z from "zod"

export type ProjectConfig = {
  name: string
  version: string
  build: {
    "output-directory"?: string
    "source-directory": string
  }
}

export const ProjectConfigSchema = z.object({
  name: z.string(),
  version: z.string(),
  build: z.object({
    "output-directory": z.string().optional(),
    "source-directory": z.string(),
  }),
})
