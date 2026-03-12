import Path from "node:path"

export function logFile(tag: string, file: string): void {
  console.log(`[${tag}] ${Path.relative(process.cwd(), file)}`)
}
