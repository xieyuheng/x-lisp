import { Buffer } from "node:buffer"
import fs from "node:fs"

// The result string does not include the ending "\n".

export function readline(): string {
  const stdinFd = 0
  const newlineByte = 10
  const maxLength = 1024
  const buffer = Buffer.alloc(maxLength)
  let offset = 0
  while (offset < maxLength) {
    const readLength = fs.readSync(stdinFd, buffer, { offset, length: 1 })
    if (readLength === 0) {
      return buffer.slice(0, offset).toString()
    }

    const byte = buffer[offset]
    if (byte === newlineByte) {
      return buffer.slice(0, offset).toString()
    }

    offset++
  }

  let message = `[readline] line too long\n`
  message += `  max length: ${maxLength}\n`
  throw new Error(message)
}
