import fs from "node:fs"

export type File = {
  fd: number
}

export function fileOpenForRead(path: string): File {
  return {
    fd: fs.openSync(path, "r"),
  }
}

export function fileOpenForWrite(path: string): File {
  return {
    fd: fs.openSync(path, "w"),
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
