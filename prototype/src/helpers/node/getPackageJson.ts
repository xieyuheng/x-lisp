import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

export function getPackageJson() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  const packageFile = path.join(currentDir, "../../../package.json")
  const packageText = fs.readFileSync(packageFile, "utf8")
  return JSON.parse(packageText)
}
