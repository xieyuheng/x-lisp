import {
  callWithFile,
  fileRead,
  openInputFile,
} from "@xieyuheng/helpers.js/file"
import * as M from "../index.ts"

export function loadPackageConfig(file: string): M.PackageConfig {
  return callWithFile(openInputFile(file), (file) => {
    const text = fileRead(file)
    const data = JSON.parse(text)
    return M.PackageConfigSchema.parse(data)
  })
}
