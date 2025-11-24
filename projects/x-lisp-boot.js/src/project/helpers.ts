import fs from "node:fs"
import Path from "node:path"
import * as X from "../lang/index.ts"

export function logFile(tag: string, file: string): void {
  console.log(`[${tag}] ${Path.relative(process.cwd(), file)}`)
}

export function writeFile(file: string, text: string): void {
  fs.mkdirSync(Path.dirname(file), { recursive: true })
  fs.writeFileSync(file, text)
}

export function isTest(id: string): boolean {
  return id.endsWith("test" + X.suffix)
}

export function isSnapshot(id: string): boolean {
  return id.endsWith("snapshot" + X.suffix)
}
