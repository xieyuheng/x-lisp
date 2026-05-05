import * as z from "zod"

export type ProjectConfig = {
  name: string
  version: string
  build: {
    "source-directory": string
    "output-directory": string
    "snapshot-directory": string
  }
}

export const ProjectConfigSchema = z.object({
  name: z.string(),
  version: z.string(),
  build: z.object({
    "source-directory": z.string(),
    "output-directory": z.string(),
    "snapshot-directory": z.string(),
  }),
})
