import fs from "node:fs"
import type { File } from "./File.ts"

export function fileWrite(file: File, text: string): void {
  const buffer = Buffer.from(text, "utf-8")
  let offset = 0
  while (offset < buffer.length) {
    offset += fs.writeSync(file.fd, buffer, offset, buffer.length - offset)
  }
}
