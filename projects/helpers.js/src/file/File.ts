import fs from "node:fs"

export type File = {
  fileDescriptor: number
}

export function fileOpenForRead(path: string): File {
  return {
    fileDescriptor: fs.openSync(path, "r")
  }

}

export function fileOpenForWrite(path: string): File {
  return {
    fileDescriptor: fs.openSync(path, "w")
  }
}

export function fileClose(file: File): void {
  fs.closeSync(file.fileDescriptor)
}
