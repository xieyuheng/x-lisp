import fs from "node:fs"
import Path from "node:path"

export type File = {
  fd: number
  path?: string
}

export function openInputFile(path: string): File {
  return {
    fd: fs.openSync(path, "r"),
    path,
  }
}

export function openOutputFile(path: string): File {
  fs.mkdirSync(Path.dirname(path), { recursive: true })

  return {
    fd: fs.openSync(path, "w"),
    path,
  }
}

export function fileClose(file: File): void {
  fs.closeSync(file.fd)
}

export function callWithFile<A>(file: File, f: (file: File) => A): A {
  const result = f(file)
  fileClose(file)
  return result
}
