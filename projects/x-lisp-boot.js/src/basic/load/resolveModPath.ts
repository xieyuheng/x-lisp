import { pathRelativeToCwd } from "@xieyuheng/helpers.js/url"
import fs from "node:fs"
import Path from "node:path"

export const suffix = ".basic"

export function resolveModPath(inputPath: string): string {
  let path = inputPath
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    path = `${path}/index${suffix}`
  }

  if (Path.extname(path) === "") {
    path = `${path}${suffix}`
  }

  if (!fs.existsSync(path)) {
    let message = `[resolveModPath] resolved path does not exist as a file`
    message += `\n  input path: ${pathRelativeToCwd(path)}`
    message += `\n  resolved path: ${pathRelativeToCwd(path)}`
    throw new Error(message)
  }

  return path
}
