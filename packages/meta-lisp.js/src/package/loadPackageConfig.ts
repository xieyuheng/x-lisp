import { callWithFile, fileRead, openInputFile } from "@xieyuheng/std.js/file"
import { type PackageConfig, PackageConfigSchema } from "./PackageConfig.ts"

export function loadPackageConfig(configPath: string): PackageConfig {
  return callWithFile(openInputFile(configPath), (file) => {
    const text = fileRead(file)
    const data = JSON.parse(text)
    return PackageConfigSchema.parse(data)
  })
}
