import * as z from "zod"

export type PackageConfig = {
  name: string
  version: string
  entry?: string
  build: {
    "source-directory": string
    "output-directory": string
    "snapshot-directory": string
  }
}

export const PackageConfigSchema = z.object({
  name: z.string(),
  version: z.string(),
  entry: z.string().optional(),
  build: z.object({
    "source-directory": z.string(),
    "output-directory": z.string(),
    "snapshot-directory": z.string(),
  }),
})
