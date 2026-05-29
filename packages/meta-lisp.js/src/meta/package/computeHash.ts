import crypto from "node:crypto"
import fs from "node:fs"
import Path from "node:path"
import * as M from "../index.ts"

export function computePackageHashFromConfig(configPath: string): string {
  const config = M.loadPackageConfig(configPath)
  const rootDirectory = Path.resolve(Path.dirname(configPath))
  const rawJSON = fs.readFileSync(configPath, "utf-8")
  const parts: Array<string> = [rawJSON]

  const sourceDirectory = Path.resolve(
    rootDirectory,
    config.build["source-directory"],
  )
  const metaFiles: Array<string> = []
  if (fs.existsSync(sourceDirectory)) {
    for (const name of fs.readdirSync(sourceDirectory, {
      encoding: "utf-8",
      recursive: true,
    })) {
      if (name.endsWith(".meta")) {
        metaFiles.push(name)
      }
    }
  }

  metaFiles.sort()

  for (const name of metaFiles) {
    const filePath = Path.join(sourceDirectory, name)
    const content = fs.readFileSync(filePath, "utf-8")
    parts.push(name)
    parts.push(content)
  }

  const joined = parts.join("")
  const hash = crypto.createHash("sha256").update(joined).digest("hex")
  return hash.slice(0, 8)
}
