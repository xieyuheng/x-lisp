import fs from "node:fs"

export function fileRead(file: string): string {
  return fs.readFileSync(file, "utf-8")
}
