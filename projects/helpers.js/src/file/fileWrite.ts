import fs from "node:fs"
import util from "node:util"
import process from "node:process"
import type { File } from "./File.ts"
import assert from "node:assert"

export function fileWrite(file: File, text: string): void {
  const buffer = Buffer.from(text, "utf-8")
  let offset = 0
  while (offset < buffer.length) {
    offset += fs.writeSync(file.fd, buffer, offset, buffer.length - offset)
  }
}

export function filePrint(file: File, x: any): void {
  fileWrite(file, util.inspect(x))
}

export function filePrintln(file: File, x: any): void {
  fileWrite(file, util.inspect(x))
  fileWrite(file, "\n")
}

const outputFiles: Array<File> = [{ fd: process.stdout.fd }]

export function currentOutputFile() {
  const file = outputFiles[outputFiles.length - 1]
  assert(file)
  return file
}


export function write(text: string): void {
  fileWrite(currentOutputFile(), text)
}

export function print(x: any): void {
  filePrint(currentOutputFile(), x)
}

export function println(x: any): void {
  filePrintln(currentOutputFile(), x)
}
