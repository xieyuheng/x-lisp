import * as z from "zod"

import type { CompilerOptions } from "../CompilerOptions.ts"

export type PackageConfig = {
  name: string
  version: string
  entry?: string
  dependencies: Record<string, string>
  prelude: Record<string, Array<string>>
  build: {
    "source-directory": string
    "output-directory": string
    "snapshot-directory": string
  }
  compiler: CompilerOptions
}

export const PackageConfigSchema = z.object({
  name: z.string(),
  version: z.string(),
  entry: z.string().optional(),
  dependencies: z.record(z.string(), z.string()).default({}),
  prelude: z.record(z.string(), z.array(z.string())).default({}),
  build: z.object({
    "source-directory": z.string(),
    "output-directory": z.string(),
    "snapshot-directory": z.string(),
  }),
  compiler: z.record(z.string(), z.string()).default({}),
})
