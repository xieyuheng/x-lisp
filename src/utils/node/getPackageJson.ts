import fs from "node:fs"
import Path from "node:path"
import { fileURLToPath } from "node:url"

export function getPackageJson() {
  const currentDir = Path.dirname(fileURLToPath(import.meta.url))
  const packageFile = Path.join(currentDir, "../../../package.json")
  const packageText = fs.readFileSync(packageFile, "utf8")
  return JSON.parse(packageText)
}
