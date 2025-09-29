import fs from "node:fs"
import Path from "path"

export function resolveModPath(inputPath: string): string {
  let path = inputPath
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    path = `${path}/index.lisp`
  }

  if (Path.extname(path) === "") {
    path = `${path}.lisp`
  }

  if (!fs.existsSync(path)) {
    let message = `[resoleModPath] resolved path does not exist as a file\n`
    message += `  input path: ${path}\n`
    message += `  resolved path: ${path}\n`
    throw new Error(message)
  }

  return path
}
