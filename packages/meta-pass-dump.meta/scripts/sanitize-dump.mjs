import { readFileSync, writeFileSync } from "node:fs"
import { relative, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const pkgDir = dirname(scriptDir)

for (const filepath of process.argv.slice(2)) {
  let content = readFileSync(filepath, "utf-8")
  content = content.replace(/"(\/[^"]*)"/g, (_, path) => {
    const rel = relative(pkgDir, path)
    return `"${rel}"`
  })
  writeFileSync(filepath, content)
}
