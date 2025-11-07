import fs from "node:fs"
import Path from "node:path"
import { pathRelativeToCwd } from "../../helpers/url/urlRelativeToCwd.ts"

export function resolveModPath(inputPath: string): string {
  let path = inputPath
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    path = `${path}/index.lisp`
  }

  if (Path.extname(path) === "") {
    path = `${path}.lisp`
  }

  if (!fs.existsSync(path)) {
    let message = `[resolveModPath] resolved path does not exist as a file`
    message += `\n  input path: ${pathRelativeToCwd(path)}`
    message += `\n  resolved path: ${pathRelativeToCwd(path)}`
    throw new Error(message)
  }

  return path
}
