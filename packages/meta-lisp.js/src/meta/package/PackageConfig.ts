import * as z from "zod"

import { type Lang } from "../language/Lang.ts"
import type { CompilerOptions } from "./CompilerOptions.ts"

export type PackageConfig = {
  name: string
  version: string
  entry?: string
  language?: Lang
  build: {
    "source-directory": string
    "output-directory": string
  }
  dependencies: Record<string, string>
  prelude: Record<string, Array<string>>
  compiler: CompilerOptions
}

export const PackageConfigSchema = z.object({
  name: z.string(),
  version: z.string(),
  entry: z.string().optional(),
  language: z.enum(["zh", "en"]).optional(),
  build: z.object({
    "source-directory": z.string(),
    "output-directory": z.string(),
  }),
  dependencies: z.record(z.string(), z.string()).default({}),
  prelude: z.record(z.string(), z.array(z.string())).default({}),
  compiler: z.record(z.string(), z.string()).default({}),
})
