import { Buffer } from "node:buffer"
import fs from "node:fs"

// The result string does not include the ending "\n".

export function readline(): string {
  const fd = fs.openSync("/dev/stdin", "rs")
  const newlineByte = 10
  const maxLength = 1024
  const buffer = Buffer.alloc(maxLength)
  let offset = 0
  while (offset < maxLength) {
    const readLength = fs.readSync(fd, buffer, { offset, length: 1 })
    if (readLength === 0) {
      fs.closeSync(fd)
      return buffer.slice(0, offset).toString()
    }

    const byte = buffer[offset]
    if (byte === newlineByte) {
      fs.closeSync(fd)
      return buffer.slice(0, offset).toString()
    }

    offset++
  }

  fs.closeSync(fd)
  let message = `[readline] line too long\n`
  message += `  max length: ${maxLength}\n`
  throw new Error(message)
}
