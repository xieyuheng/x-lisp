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
